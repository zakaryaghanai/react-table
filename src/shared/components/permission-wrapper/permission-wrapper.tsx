import { FC, ReactNode } from "react";
interface PolicyProps {
  children: ReactNode;
  permissions: boolean[];
}
export const PermissionWrapper: FC<PolicyProps> = (props) => {
  const { children, permissions } = props;

  if (!permissions) {
    return null;
  }

  return children;
};
