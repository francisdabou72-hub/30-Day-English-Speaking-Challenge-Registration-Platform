create or replace function register_for_challenge(
  p_first_name text,
  p_last_name  text,
  p_whatsapp   text,
  p_email      text,
  p_department text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_dept  challenge_departments%rowtype;
  v_id    uuid;
begin
  -- Lock the department row to serialize concurrent submissions for the same dept
  select * into v_dept from challenge_departments where id = p_department for update;
  if not found then
    return jsonb_build_object('ok', false, 'code', 'unknown_department');
  end if;
  if not v_dept.is_open then
    return jsonb_build_object('ok', false, 'code', 'department_closed');
  end if;
  if v_dept.whatsapp_invite_url is null then
    return jsonb_build_object('ok', false, 'code', 'department_unavailable');
  end if;

  begin
    insert into challenge_registrations
      (first_name, last_name, whatsapp_e164, email_normalized, department)
    values
      (btrim(p_first_name), btrim(p_last_name), p_whatsapp,
       nullif(lower(btrim(coalesce(p_email,''))), ''), p_department)
    returning id into v_id;
  exception
    when unique_violation then
      -- Distinguish which unique index fired (if we can), else generic duplicate
      return jsonb_build_object('ok', false, 'code', 'duplicate');
  end;

  return jsonb_build_object(
    'ok', true,
    'registration_id', v_id,
    'department', v_dept.id,
    'whatsapp_invite_url', v_dept.whatsapp_invite_url
  );
end;
$$;

revoke all on function register_for_challenge(text,text,text,text,text) from public;
grant execute on function register_for_challenge(text,text,text,text,text) to service_role;
