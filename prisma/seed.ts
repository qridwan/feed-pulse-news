import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Status } from "@prisma/client";
import { faker } from "@faker-js/faker";

const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DIRECT_URL or DATABASE_URL must be set in the environment");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/(-)+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  console.log("🌱 Starting seed...");

  try {
    // 1. Test admin user
    const admin = await prisma.admin.upsert({
      where: { email: "admin@simplynews.test" },
      update: {},
      create: {
        email: "admin@simplynews.test",
        supabaseId: faker.string.uuid(),
      },
    });
    console.log("✓ Admin created:", admin.email);

    // 2. Sample news sources (3–5)
    const sourceNames = [
      "Tech Daily",
      "Global News Network",
      "Local Tribune",
      "Science Today",
      "Business Pulse",
    ];
    const sources = await Promise.all(
      sourceNames.map((name) =>
        prisma.source.upsert({
          where: { slug: slugify(name) },
          update: {},
          create: {
            name,
            slug: slugify(name),
            website: `https://${slugify(name)}.example.com`,
            logoUrl: faker.image.urlPlaceholder({ width: 64, height: 64 }),
            description: faker.company.catchPhrase(),
            isActive: true,
          },
        })
      )
    );
    console.log("✓ Sources created:", sources.length);

    // 3. Sample tags (5–10)
    const tagNames = [
      "Technology",
      "Politics",
      "Health",
      "Sports",
      "Entertainment",
      "Science",
      "Business",
      "World",
    ];
    const tags = await Promise.all(
      tagNames.map((name) =>
        prisma.tag.upsert({
          where: { slug: slugify(name) },
          update: {},
          create: {
            name,
            slug: slugify(name),
          },
        })
      )
    );
    console.log("✓ Tags created:", tags.length);

    // 4. Sample news articles (10–15) with various statuses (idempotent: fixed slugs)
    const statuses: Status[] = [Status.DRAFT, Status.PUBLISHED, Status.PUBLISHED, Status.PUBLISHED, Status.ARCHIVED];
    const newsCount = 12;
    faker.seed(42); // reproducible titles

    for (let i = 0; i < newsCount; i++) {
      const title = faker.helpers.arrayElement([
        faker.lorem.sentence({ min: 4, max: 8 }),
        faker.company.catchPhrase(),
      ]);
      const slug = `seed-article-${i + 1}`;
      const status = faker.helpers.arrayElement(statuses);
      const source = faker.helpers.arrayElement(sources);
      const articleTags = faker.helpers.arrayElements(tags, { min: 1, max: 4 });

      await prisma.news.upsert({
        where: { slug },
        update: {},
        create: {
          title,
          slug,
          publishedDate: faker.date.recent({ days: 30 }),
          newsLink: faker.datatype.boolean(0.3) ? faker.internet.url() : null,
          shortDescription: faker.lorem.paragraph().slice(0, 150),
          fullContent: faker.lorem.paragraphs({ min: 2, max: 5 }, "\n\n"),
          thumbnailUrl: faker.image.urlPlaceholder({ width: 800, height: 450 }),
          status,
          views: status === Status.PUBLISHED ? faker.number.int({ min: 0, max: 5000 }) : 0,
          authorId: admin.id,
          sourceId: source.id,
          newsTags: {
            create: articleTags.map((tag) => ({ tagId: tag.id })),
          },
        },
      });
    }
    console.log("✓ News articles created:", newsCount);
  } catch (error) {
    console.error("✗ Seed failed:", error);
    throw error;
  }

  console.log("🌱 Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
