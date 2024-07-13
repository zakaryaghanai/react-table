export type User = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  role: {
    name: string;
  };
  active: boolean;
};
