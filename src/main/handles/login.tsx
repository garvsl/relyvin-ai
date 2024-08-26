import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const login = async (password: any, prisma: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'relyvin@purelymail.com' },
    });
    if (!user) {
      throw new Error('User not found');
    }

    const match = await bcrypt.compare(password, user.hashedPassword);

    if (match) {
      const session = await prisma.session.create({
        data: {
          sid: uuidv4(),
          data: JSON.stringify({
            userId: user.id,
          }),
          expiresAt: new Date('9999-12-31T23:59:59Z'),
        },
      });
      sessionStorage.setItem('sessionId', session.sid);

      //   now store the sessionId somewhere to get the user later

      return { success: true, user };
    }
    return { success: false };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export default login;
