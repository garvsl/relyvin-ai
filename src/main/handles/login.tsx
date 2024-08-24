import bcrypt from 'bcrypt';

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
      return { success: true, user };
    }
    return { success: false };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export default login;
