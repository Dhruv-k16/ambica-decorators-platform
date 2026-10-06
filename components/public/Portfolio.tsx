'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import portfolioManifest from '@/data/portfolio-manifest.json';

type PortfolioPhoto = {
  id: string;
  url: string;
  alt: string;
  category: string;
  categoryLabel: string;
  sortOrder: number;
};

type PortfolioCategory = {
  slug: string;
  label: string;
  photos: PortfolioPhoto[];
};

type PortfolioManifest = {
  generatedAt: string;
  categories: PortfolioCategory[];
  totalPhotos: number;
};

type PortfolioProps = {
  fullGallery?: boolean;
};

const manifest =
  portfolioManifest as PortfolioManifest;

const FILTERS = [
  {
    label: 'All Celebrations',
    value: 'all',
  },
  {
    label: 'Entrances',
    value: 'entrances',
  },
  {
    label: 'Sacred Settings',
    value: 'sacred-settings',
  },
  {
    label: 'Elegant Passages',
    value: 'elegant-passages',
  },
  {
    label: 'Gather & Celebrate',
    value: 'gather-celebrate',
  },
  {
    label: 'Picture Perfect',
    value: 'picture-perfect',
  },
  {
    label: 'Signature Stages',
    value: 'signature-stages',
  },
  {
    label: 'Complete Venue Setups',
    value: 'complete-venue-setups',
  },
];

const GALLERY_CATEGORY_ORDER = [
  'entrances',
  'sacred-settings',
  'elegant-passages',
  'gather-celebrate',
  'picture-perfect',
  'signature-stages',
  'complete-venue-setups',
];

export default function Portfolio({
  fullGallery = false,
}: PortfolioProps) {
  const [activeFilter, setActiveFilter] =
    useState('all');

  const [selectedPhoto, setSelectedPhoto] =
    useState<PortfolioPhoto | null>(null);

  /*
   * Return the portfolio categories
   * in the exact order we want on the website.
   */
  const getCategorySections = () => {
    return GALLERY_CATEGORY_ORDER
      .map((slug) =>
        manifest.categories.find(
          (category) =>
            category.slug === slug
        )
      )
      .filter(
        (
          category
        ): category is PortfolioCategory =>
          Boolean(category?.photos?.length)
      );
  };

  /*
   * All gallery photos.
   *
   * This is used only for the lightbox when
   * "All Celebrations" is active.
   */
  const allGalleryPhotos = useMemo(() => {
    return getCategorySections().flatMap(
      (category) => category.photos
    );
  }, []);

  /*
   * One representative photo from each category.
   *
   * Homepage uses these 7 photos.
   */
  const homepagePhotos = useMemo(() => {
    return getCategorySections().map(
      (category) => category.photos[0]
    );
  }, []);

  /*
   * Current selected category.
   */
  const activeCategory = useMemo(() => {
    return (
      manifest.categories.find(
        (category) =>
          category.slug === activeFilter
      ) || manifest.categories[0]
    );
  }, [activeFilter]);

  /*
   * Photos belonging to the selected category.
   */
  const filteredPhotos = useMemo(() => {
    if (activeFilter === 'all') {
      return [];
    }

    return activeCategory?.photos || [];
  }, [activeFilter, activeCategory]);

  /*
   * Photos currently displayed in the lightbox.
   *
   * Homepage:
   *   → 7 homepage showcase photos
   *
   * Full gallery + category:
   *   → photos from that category
   *
   * Full gallery + All Celebrations:
   *   → all 95 photos
   */
  const lightboxPhotos = useMemo(() => {
    if (!selectedPhoto) {
      return [];
    }

    if (!fullGallery) {
      return homepagePhotos;
    }

    if (activeFilter !== 'all') {
      return filteredPhotos;
    }

    return allGalleryPhotos;
  }, [
    selectedPhoto,
    fullGallery,
    activeFilter,
    homepagePhotos,
    filteredPhotos,
    allGalleryPhotos,
  ]);

  /*
   * Find the currently opened image inside
   * the active lightbox collection.
   */
  const selectedIndex =
    selectedPhoto && lightboxPhotos.length
      ? lightboxPhotos.findIndex(
        (photo) =>
          photo.id === selectedPhoto.id
      )
      : -1;

  /*
   * Close lightbox with ESC and navigate
   * with keyboard arrows.
   */
  useEffect(() => {
    if (!selectedPhoto) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === 'Escape') {
        setSelectedPhoto(null);
      }

      if (event.key === 'ArrowLeft') {
        showPrevious();
      }

      if (event.key === 'ArrowRight') {
        showNext();
      }
    }

    document.addEventListener(
      'keydown',
      handleKeyDown
    );

    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown
      );

      document.body.style.overflow = '';
    };
  }, [selectedPhoto, lightboxPhotos]);

  /*
   * Previous lightbox image.
   */
  function showPrevious() {
    if (
      selectedIndex < 0 ||
      lightboxPhotos.length === 0
    ) {
      return;
    }

    const previousIndex =
      selectedIndex === 0
        ? lightboxPhotos.length - 1
        : selectedIndex - 1;

    setSelectedPhoto(
      lightboxPhotos[previousIndex]
    );
  }

  /*
   * Next lightbox image.
   */
  function showNext() {
    if (
      selectedIndex < 0 ||
      lightboxPhotos.length === 0
    ) {
      return;
    }

    const nextIndex =
      selectedIndex ===
        lightboxPhotos.length - 1
        ? 0
        : selectedIndex + 1;

    setSelectedPhoto(
      lightboxPhotos[nextIndex]
    );
  }

  /*
   * Render one clean portfolio image.
   *
   * IMPORTANT:
   * No category text or overlay is placed
   * on top of the photograph.
   */
  /*
   * Brand watermark.
   *
   * The original portfolio photographs are never modified.
   * The logo is rendered as a website overlay instead.
   */
  function getLogoForPhoto(photo: PortfolioPhoto) {
    switch (photo.category) {
      case 'elegant-passages':
      case 'gather-celebrate':
      case 'picture-perfect':
        return '/assets/logo-purple.png';

      case 'complete-venue-setups':
      case 'signature-stages':
      case 'sacred-settings':
      case 'entrances':
      default:
        return '/assets/logo-white.png';
    }
  }

  function renderPhoto(
    photo: PortfolioPhoto
  ) {
    return (
      <article
        key={photo.id}
        className="ambica-portfolio-card"
        onClick={() =>
          setSelectedPhoto(photo)
        }
      >
        <img
          src={photo.url}
          alt={photo.alt}
          className="ambica-portfolio-image"
          loading="lazy"
          decoding="async"
        />

        <img
          src={getLogoForPhoto(photo)}
          alt=""
          aria-hidden="true"
          className="ambica-portfolio-watermark"
          draggable={false}
        />
      </article>
    );
  }

  return (
    <>
      <section
        className={`ambica-portfolio ${fullGallery
            ? 'ambica-portfolio-full'
            : 'ambica-portfolio-home'
          }`}
        id="portfolio"
      >
        {/* =========================
            HEADER
           ========================= */}

        <div className="ambica-portfolio-head">
          <div>
            <div className="ambica-portfolio-label">
              {fullGallery
                ? 'OUR COMPLETE COLLECTION'
                : 'SELECTED WORK'}
            </div>

            <h2>
              OUR WORK,{' '}
              <em>YOUR INSPIRATION.</em>
            </h2>
          </div>

          {!fullGallery && (
            <Link
              href="/portfolio"
              className="ambica-portfolio-gallery"
            >
              View Full Gallery
              <span>→</span>
            </Link>
          )}

          {fullGallery && (
            <div className="ambica-portfolio-count">
              {manifest.totalPhotos}
              <span> photographs</span>
            </div>
          )}
        </div>

        {/* =========================
            FILTERS
            Only shown on full gallery.
           ========================= */}

        {fullGallery && (
          <div className="ambica-portfolio-filters">
            {FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={
                  activeFilter === filter.value
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setActiveFilter(
                    filter.value
                  )
                }
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}

        {/* =========================
            HOMEPAGE
            7 category showcase photos.
           ========================= */}

        {!fullGallery && (
          <>
            <div className="ambica-portfolio-grid">
              {homepagePhotos.map(
                renderPhoto
              )}
            </div>

            <div className="ambica-portfolio-footer">
              <Link
                href="/portfolio"
                className="ambica-portfolio-view-all"
              >
                Explore All{' '}
                {manifest.totalPhotos} Photos
                <span>→</span>
              </Link>
            </div>
          </>
        )}

        {/* =========================
            FULL GALLERY
            ALL CELEBRATIONS
           ========================= */}

        {fullGallery &&
          activeFilter === 'all' && (
            <div className="ambica-portfolio-sections">
              {getCategorySections().map(
                (category) => (
                  <section
                    key={category.slug}
                    className="ambica-portfolio-category"
                  >
                    <div className="ambica-portfolio-category-head">
                      <h3>
                        {category.label}
                      </h3>

                      <span>
                        {category.photos.length}{' '}
                        photos
                      </span>
                    </div>

                    <div className="ambica-portfolio-grid">
                      {category.photos.map(
                        renderPhoto
                      )}
                    </div>
                  </section>
                )
              )}
            </div>
          )}

        {/* =========================
            FULL GALLERY
            FILTERED CATEGORY
           ========================= */}

        {fullGallery &&
          activeFilter !== 'all' && (
            <div className="ambica-portfolio-filtered">
              <div className="ambica-portfolio-category-head">
                <h3>
                  {activeCategory?.label}
                </h3>

                <span>
                  {filteredPhotos.length} photos
                </span>
              </div>

              <div className="ambica-portfolio-grid">
                {filteredPhotos.map(
                  renderPhoto
                )}
              </div>
            </div>
          )}
      </section>

      {/* =========================
          LIGHTBOX
         ========================= */}

      {selectedPhoto && (
        <div
          className="ambica-portfolio-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio image viewer"
          onClick={() =>
            setSelectedPhoto(null)
          }
        >
          {/* Close */}
          <button
            type="button"
            className="ambica-portfolio-lightbox-close"
            aria-label="Close image viewer"
            onClick={() =>
              setSelectedPhoto(null)
            }
          >
            ×
          </button>

          {/* Previous */}
          <button
            type="button"
            className="ambica-portfolio-lightbox-prev"
            aria-label="Previous image"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
          >
            ‹
          </button>

          {/* Image */}
          <div
            className="ambica-portfolio-lightbox-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.alt}
            />

            <img
              src={getLogoForPhoto(selectedPhoto)}
              alt=""
              aria-hidden="true"
              className="ambica-portfolio-lightbox-watermark"
              draggable={false}
            />

            <div className="ambica-portfolio-lightbox-caption">
              <span>
                Ambica Decorators
              </span>

              <small>
                {selectedIndex + 1} /{' '}
                {lightboxPhotos.length}
              </small>
            </div>
          </div>

          {/* Next */}
          <button
            type="button"
            className="ambica-portfolio-lightbox-next"
            aria-label="Next image"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}