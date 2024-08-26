const getUser = async (sessionId: any, prisma: any) => {
  try {
    const session = await prisma.session.findUnique({
      where: { sid: sessionId },
    });

    const user = await prisma.user.findUnique({
      where: { id: JSON.parse(session.data).userId },
    });
    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export default getUser;
