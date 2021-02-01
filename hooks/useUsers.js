import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { fetchUsers, usersSelector } from "../redux/users";

function useUsers() {
  const dispatch = useDispatch();
  const users = useSelector(usersSelector);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return { users };
}

export default useUsers;
