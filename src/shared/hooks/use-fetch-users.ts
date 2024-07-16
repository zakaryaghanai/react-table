import { useState } from "react";
import { generateFakeUsers } from "../../helpers/users-faker";
import { User } from "../types/user";

export const useFetchUsers = () => {

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = async (number: number = 1244) => {
    setLoading(true)
    setTimeout(() => {
      setUsers([...users, ...generateFakeUsers(number)])
      setLoading(false)
    }, 1000)
  }

  return { users, loading, fetchUsers };
}