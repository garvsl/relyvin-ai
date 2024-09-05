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
      name: 'Moh',
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
            title: 'Personalized Partnership',
            body: `Hi {},

I really liked your Instagram, as your content & vibe really aligns with our brand’s vision at relyvin (https://www.relyvin.com), thus I am reaching out!

We help influencers who would like to travel to Turkey secure exclusive medical tourism packages that are personalized--without compromising on any quality.

I'd love to chat, let me know if you are interested in this opportunity. Looking forward to hearing from you! :)

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

  const usernamesJson = JSON.parse(fs.readFileSync('usernames.json', 'utf-8'));
  const usernames = usernamesJson.map(
    (inf: {
      id: string;
      handle: string;
      created: string;
      checked: boolean;
    }) => {
      return {
        id: inf.id,
        handle: inf.handle,
        checked: inf.checked,
        created: new Date(inf.created),
      };
    },
  );

  await prisma.username.createMany({
    data: usernames,
    skipDuplicates: true,
  });
}

// need to update influencers json
// need to do instead usernames json
// thats it then seed to aws

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
