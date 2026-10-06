import fs from 'node:fs';
import path from 'node:path';

const portfolioRoot = path.join(
  process.cwd(),
  'public',
  'assets',
  'portfolio'
);

const outputDir = path.join(
  process.cwd(),
  'data'
);

const outputFile = path.join(
  outputDir,
  'portfolio-manifest.json'
);

const categoryMap = {
  gate: {
    slug: 'entrances',
    label: 'Entrances',
  },
  mandap: {
    slug: 'sacred-settings',
    label: 'Sacred Settings',
  },
  passage: {
    slug: 'elegant-passages',
    label: 'Elegant Passages',
  },
  seating: {
    slug: 'gather-celebrate',
    label: 'Gather & Celebrate',
  },
  'props-spots': {
    slug: 'picture-perfect',
    label: 'Picture Perfect',
  },
  stage: {
    slug: 'signature-stages',
    label: 'Signature Stages',
  },
  venue: {
    slug: 'complete-venue-setups',
    label: 'Complete Venue Setups',
  },
};

const imageExtensions = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif',
]);

function getImages(folderName) {
  const folderPath = path.join(
    portfolioRoot,
    folderName
  );

  if (!fs.existsSync(folderPath)) {
    return [];
  }

  return fs
    .readdirSync(folderPath, { withFileTypes: true })
    .filter((entry) => {
      if (!entry.isFile()) return false;

      const extension = path.extname(entry.name).toLowerCase();

      return imageExtensions.has(extension);
    })
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: 'base',
      })
    )
    .map((entry, index) => ({
      id: `${folderName}-${index + 1}`,
      url: `/assets/portfolio/${folderName}/${encodeURIComponent(
        entry.name
      )}`,
      alt: `Ambica Decorators ${
        categoryMap[folderName]?.label || folderName
      }`,
      category:
        categoryMap[folderName]?.slug || folderName,
      categoryLabel:
        categoryMap[folderName]?.label || folderName,
      sortOrder: index,
    }));
}

const categories = Object.entries(categoryMap).map(
  ([folder, category]) => ({
    ...category,
    folder,
    photos: getImages(folder),
  })
);

const photos = categories.flatMap(
  (category) => category.photos
);

const manifest = {
  generatedAt: new Date().toISOString(),

  categories: [
    {
      slug: 'all',
      label: 'All Celebrations',
      photos,
    },
    ...categories,
  ],

  totalPhotos: photos.length,
};

fs.mkdirSync(outputDir, {
  recursive: true,
});

fs.writeFileSync(
  outputFile,
  JSON.stringify(manifest, null, 2),
  'utf8'
);

console.log('');
console.log('🌸 Ambica Decorators Portfolio Manifest');
console.log('');

for (const category of categories) {
  console.log(
    `✓ ${category.label}: ${category.photos.length} photos`
  );
}

console.log('');
console.log(`✓ Total photos: ${photos.length}`);
console.log(`✓ Manifest: ${outputFile}`);
console.log('');
