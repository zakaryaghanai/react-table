import { faker } from "@faker-js/faker";
import { User } from "../shared/types/user";
import { ROLES } from "../shared/types/roles";

export const generateFakeUsers = (number: number = 10) => {
  const fakeUsers: User[] = []

  for (let i = 0; i < number; i++) {
    const sex = faker.person.sexType();
    const firstName = faker.person.firstName(sex);
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName, provider: 'gmail.com' });

    fakeUsers.push({
      id: faker.string.uuid(),
      username: `${firstName} ${lastName}`,
      email,
      createdAt: "1718122664336",
      updatedAt: "1718122664336",
      role: {
        name: faker.helpers.arrayElement(Object.values(ROLES)),
      },
      active: faker.datatype.boolean(),
    })
  }

  return fakeUsers;
}