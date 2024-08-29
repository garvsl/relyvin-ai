import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      email: 'relyvin@purelymail.com',
      name: 'Garv',
      password: 'zohhyg-bezkyh-fyzfI8',
    },
    {
      email: 'kivanc@relyvin.com',
      name: 'Kivanc',
      password: 'zohhyg-bezkyh-fyzfI8',
    },
    {
      email: 'moh@relyvin.com',
      name: 'Mohammad',
      password: 'zohhyg-bezkyh-fyzfI8',
    },
  ];

  users.map(async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        hashedPassword,
        Script: {
          create: {
            title: 'Personalized Package',
            body: `Hey {},

I really liked your Instagram, as your content & vibe really aligns with our brand’s vision at relyvin (https://www.relyvin.com), thus I am reaching out!

We help emerging influencers who would like to travel to Turkey secure exclusive medical tourism packages, without any hassle or compromising on quality.

Let me know if you are interested in this opportunity. Looking forward to hearing from you! :)

Best regards,
${user.name}`,
          },
        },
      },
    });
  });

  const influencersJson = JSON.parse(
    fs.readFileSync('influencers.json', 'utf-8'),
  );
  const influencers = influencersJson.map(
    (inf: { handle: string; email: string; name: string; created: string }) => {
      return {
        handle: inf.handle,
        email: inf.email,
        name: inf.name,
        created: new Date(inf.created),
      };
    },
  );

  await prisma.influencer.createMany({
    data: influencers,
    skipDuplicates: true,
  });

  const usernamesFile = fs.readFileSync('usernames.txt', 'utf-8').split('\n');
  const usernames = usernamesFile.map((name) => {
    return {
      handle: name,
    };
  });

  await prisma.username.createMany({
    data: usernames,
    skipDuplicates: true,
  });
}

main()
  // eslint-disable-next-line promise/always-return
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
