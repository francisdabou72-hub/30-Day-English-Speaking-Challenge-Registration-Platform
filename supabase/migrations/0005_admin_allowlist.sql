insert into challenge_admins (user_id)
values ('1043bbd1-9278-4dbc-885d-a5cd7ee41b44')
on conflict (user_id) do nothing;
