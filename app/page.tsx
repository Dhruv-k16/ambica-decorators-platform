'use client';

import { useEffect, useState } from 'react';
import Portfolio from '@/components/public/Portfolio';
import Navbar from '@/components/public/Navbar';
import EnquiryModal from '@/components/public/EnquiryModal';

type PublicData = {
  projects: Array<{
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    eventType?: string | null;
    location?: string | null;
    coverImage?: string | null;
    photos?: Array<{
      id: string;
      url: string;
      alt?: string | null;
      sortOrder: number;
    }>;
  }>;

  reviews: Array<{
    id: string;
    clientName: string;
    rating: number;
    text: string;
    eventType?: string | null;
    location?: string | null;
  }>;

  services: Array<{
    id: string;
    name: string;
    description?: string | null;
    image?: string | null;
    sortOrder: number;
  }>;

  locations: Array<{
    id: string;
    name: string;
    state?: string | null;
    description?: string | null;
    sortOrder: number;
  }>;

  faqs: Array<{
    id: string;
    question: string;
    answer: string;
    sortOrder: number;
  }>;

  settings: Record<string, string>;
};

const FALLBACK_SERVICES = [
  'Wedding Decoration',
  'Wedding Planning',
  'Event Management',
  'Wedding Designing',
  'Event Setup',
  'Venue Décor',
];

const SERVICE_IMAGES = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=88',
  'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1000&q=88',
  'https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1000&q=88',
  'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1000&q=88',
  'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1000&q=88',
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=88',
];

export default function HomePage() {
  const [data, setData] = useState<PublicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<
    string | undefined
  >();
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  useEffect(() => {
    async function loadPublicData() {
      try {
        const response = await fetch('/api/public');

        if (!response.ok) {
          throw new Error('Unable to load website content.');
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Public website load error:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPublicData();
  }, []);

  const openEnquiry = (service?: string) => {
    setPreselectedService(service);
    setEnquiryOpen(true);
  };

  const closeEnquiry = () => {
    setEnquiryOpen(false);
    setPreselectedService(undefined);
  };

  const services =
    data?.services?.length
      ? data.services
      : FALLBACK_SERVICES.map((name, index) => ({
        id: `fallback-${index}`,
        name,
        description: null,
        image: SERVICE_IMAGES[index],
        sortOrder: index,
      }));

  return (
    <>
      <div className="page">
        <Navbar onEnquire={() => openEnquiry()} />

        <main>
          {/* HERO */}
          <section className="hero" id="home">
            <img
              className="hero-bg"
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=2400&q=90"
              alt="Luxury wedding mandap at sunset"
            />

            <div className="hero-tint" />

            <div className="hero-top">
              <span>WEDDINGS • EVENTS • EXPERIENCES</span>
              <span>GUJARAT + RAJASTHAN</span>
            </div>

            <div className="hero-copy">
              <div className="eyebrow">AMBICA DECORATORS</div>

              <h1>
                BEYOND
                <br />
                <em>EVENTS.</em>
              </h1>

              <h2>WE CREATE EMOTIONS.</h2>

              <p>
                From intimate gatherings to grand celebrations, we design
                extraordinary experiences that stay with you long after the
                lights go down.
              </p>

              <div className="actions">
                <a className="btn white" href="#work">
                  Explore Our Work <span>→</span>
                </a>

                <button
                  className="link-btn"
                  type="button"
                  onClick={() => openEnquiry()}
                >
                  Plan Your Celebration <span>↗</span>
                </button>
              </div>
            </div>

            <div className="hero-location-strip">
              <span>
                ⌖ <b>Idar, Gujarat</b>
              </span>

              <i />

              <span>
                ⌖ <b>Udaipur & Rajsamand</b>
              </span>

              <i />

              <span>
                ◇ <b>{data?.settings?.service_radius || '250+ KM'}</b> Service Radius
              </span>
            </div>

            <div className="hero-card">
              <div className="mini-images">
                <img
                  src="https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=500&q=80"
                  alt=""
                />

                <img
                  src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=500&q=80"
                  alt=""
                />
              </div>

              <strong>{data?.settings?.heritage_statement || '45+'}</strong>

              <small>
                Years of experience
                <br />
                in celebrations
              </small>
            </div>
          </section>

          {/* ABOUT */}
          <section className="about section" id="about">
            <div className="section-label">ABOUT US</div>

            <div className="about-grid">
              <div>
                <h2>
                  MORE THAN <em>DÉCOR.</em>
                  <br />
                  IT&apos;S A PROMISE.
                </h2>

                <p className="lead">
                  At Ambica Decorators, we believe every event is a story —
                  and we&apos;re here to make it unforgettable.
                </p>

                <div className="stats">
                  <div>
                    <strong>{data?.settings?.service_radius || '250+ KM'}</strong>
                    <span>Service Radius</span>
                  </div>

                  <div>
                    <strong>100%</strong>
                    <span>Personal Attention</span>
                  </div>

                  <div>
                    <strong>3</strong>
                    <span>Key Locations</span>
                  </div>
                </div>
              </div>

              <div className="about-right">
                <p>
                  We blend creativity, tradition and precision to bring your
                  vision to life. From conceptual design to flawless
                  execution, our team handles every detail with care.
                </p>

                <a className="outline" href="#contact">
                  Know More About Us <span>→</span>
                </a>

                <div className="script-note">
                  Decorating
                  <br />
                  Moments
                  <br />
                  Designing
                  <br />
                  Memories
                </div>
              </div>
            </div>
          </section>

          {/* SERVICES */}
          <section className="services section" id="services">
            <div className="section-head">
              <div>
                <div className="section-label">OUR SERVICES</div>

                <h2>
                  CRAFTING EVERY <em>DETAIL</em>
                  <br />
                  FOR YOUR SPECIAL DAY
                </h2>
              </div>

              <button
                className="outline"
                type="button"
                onClick={() => openEnquiry()}
              >
                View All Services <span>→</span>
              </button>
            </div>

            <div className="service-row">
              {services.slice(0, 6).map((service, index) => (
                <article key={service.id}>
                  <img
                    src={service.image || SERVICE_IMAGES[index]}
                    alt={service.name}
                  />

                  <div>
                    <small>
                      {String(index + 1).padStart(2, '0')}
                    </small>

                    <h3>{service.name}</h3>

                    <button
                      type="button"
                      onClick={() => openEnquiry(service.name)}
                      aria-label={`Enquire about ${service.name}`}
                    >
                      ↗
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* FEATURED */}
          <section className="featured section">
            <div className="featured-image">
              <img
                src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=2400&q=90"
                alt="Destination wedding celebration"
              />

              <div className="featured-overlay" />

              <div className="featured-copy">
                <div className="section-label light">
                  FEATURED CELEBRATION
                </div>

                <h2>
                  DESTINATIONS
                  <br />
                  MADE <em>BEAUTIFUL.</em>
                </h2>

                <p>
                  Transforming beautiful locations into unforgettable
                  celebrations.
                </p>

                <button className="play" type="button" aria-label="Play story">
                  ▶
                </button>

                <span>Watch Our Story</span>
              </div>

              <div className="featured-tag">
                UDAIPUR
                <br />
                <small>A celebration by Ambica Decorators</small>
              </div>
            </div>
          </section>

          {/* PORTFOLIO */}
          <Portfolio />

          {/* REVIEWS */}
          <section className="reviews section" id="reviews">
            <div className="section-label">CLIENT REVIEWS</div>

            <div className="reviews-head">
              <h2>
                WORDS FROM THE
                <br />
                <em>PEOPLE WE CELEBRATE WITH.</em>
              </h2>

              <p>
                Real stories from real celebrations, shared by the people who trusted
                Ambica Decorators to bring their occasions to life.
              </p>
            </div>

            <div className="review-grid">
              {(data?.reviews || []).length > 0 ? (
                (data?.reviews || []).slice(0, 3).map((review) => (
                  <article key={review.id}>
                    <div className="stars">
                      {'★'.repeat(Math.max(0, Math.min(5, review.rating)))}
                    </div>

                    <p>“{review.text}”</p>

                    <strong>{review.clientName}</strong>

                    <small>
                      {review.eventType || 'Event'}
                      {review.location ? ` • ${review.location}` : ''}
                    </small>
                  </article>
                ))
              ) : (
                <article className="review-empty">
                  <p>
                    We&apos;re preparing more stories from our recent celebrations.
                  </p>
                  <strong>Ambica Decorators</strong>
                </article>
              )}
            </div>
          </section>

          {/* LOCATIONS */}
          <section className="locations section" id="locations">
            <div className="section-label">WHERE WE ARE</div>

            <div className="locations-grid">
              {[
                {
                  name: 'Idar',
                  state: 'Gujarat',
                  description:
                    'Our home base in Gujarat, serving weddings and celebrations across the region and surrounding destinations.',
                  label: `${data?.settings?.service_radius || '250+ KM'} SERVICE RADIUS`,
                },
                {
                  name: 'Udaipur',
                  state: 'Rajasthan',
                  description:
                    'Wedding planning and décor services across Udaipur and nearby destination wedding locations.',
                  label: 'DESTINATION WEDDINGS',
                },
                {
                  name: 'Rajsamand',
                  state: 'Rajasthan',
                  description:
                    'Complete event and tent setup services across Rajsamand and surrounding destinations.',
                  label: 'EVENT & TENT SETUP',
                },
              ].map((location, index) => (
                <div
                  className={`location-card ${index === 1
                    ? 'purple'
                    : index === 2
                      ? 'rose'
                      : ''
                    }`}
                  key={location.name}
                >
                  <span>{location.state}</span>

                  <h2>{location.name}</h2>

                  <p>{location.description}</p>

                  <b>{location.label}</b>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="faq-section section" id="faq">
            <div className="faq-layout">
              <div className="faq-intro">
                <div className="section-label">FREQUENTLY ASKED QUESTIONS</div>

                <h2>
                  HAVE QUESTIONS?
                  <br />
                  WE&apos;VE GOT <em>ANSWERS.</em>
                </h2>

                <p>
                  Everything you need to know about planning, designing and managing
                  your event with Ambica Decorators.
                </p>

                <button
                  className="btn purple"
                  type="button"
                  onClick={() => openEnquiry()}
                >
                  Start Your Enquiry <span>↗</span>
                </button>
              </div>

              <div className="faq-list">
                {data?.faqs?.length ? (
                  data.faqs.map((faq, index) => {
                    const isOpen = openFaq === faq.id;

                    return (
                      <div
                        className={`faq-item ${isOpen ? 'open' : ''}`}
                        key={faq.id}
                      >
                        <button
                          type="button"
                          className="faq-question"
                          onClick={() =>
                            setOpenFaq(isOpen ? null : faq.id)
                          }
                          aria-expanded={isOpen}
                        >
                          <span>
                            <small>{String(index + 1).padStart(2, '0')}</small>
                            {faq.question}
                          </span>

                          <b>{isOpen ? '−' : '+'}</b>
                        </button>

                        {isOpen && (
                          <div className="faq-answer">
                            <p>{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="faq-empty">
                    <p>
                      Have a question about your event? Get in touch with our team
                      and we&apos;ll be happy to help.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ENQUIRY BANNER */}
          <section className="enquiry-banner"></section>

          {/* ENQUIRY BANNER */}
          <section className="enquiry-banner">
            <div>
              <span>READY WHEN YOU ARE</span>

              <h2>
                LET&apos;S CREATE SOMETHING
                <br />
                <em>EXTRAORDINARY.</em>
              </h2>
            </div>

            <button
              className="btn purple"
              type="button"
              onClick={() => openEnquiry()}
            >
              Start Your Enquiry <span>↗</span>
            </button>
          </section>

          {/* CONTACT */}
          <section className="contact section" id="contact">
            <div className="contact-inner">
              <div className="section-label">LET&apos;S CONNECT</div>

              <h2>
                YOUR CELEBRATION
                <br />
                STARTS <em>HERE.</em>
              </h2>

              <p>
                Tell us what you&apos;re planning. Dates, location, event
                types and the services you need — we&apos;ll take it from
                there.
              </p>

              <button
                className="btn purple large"
                type="button"
                onClick={() => openEnquiry()}
              >
                Open Event Enquiry Form <span>↗</span>
              </button>
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer>
          <div className="footer-main">
            <div className="footer-brand">
              <img
                src="/assets/logo-white.png"
                alt="Ambica Decorators"
              />

              <div>
                <b>AMBICA DECORATORS</b>
                <small>WEDDING PLANNERS • EVENT MANAGERS</small>
              </div>
            </div>

            <div className="footer-links">
              <a href="#about">About</a>
              <a href="#services">Services</a>
              <a href="#work">Our Work</a>
              <a href="#reviews">Reviews</a>
              <a href="#locations">Locations</a>
              <a href="#faq">FAQ</a>
              <a href="#contact">Contact</a>
            </div>

            <div className="social">
              <a
                href={`https://www.instagram.com/${(data?.settings?.instagram_primary || 'ambicadecorators').replace(/^@/, '')}/`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ambica Decorators Instagram"
              >
                ◎
              </a>

              <a
                href={`https://www.instagram.com/${(data?.settings?.instagram_secondary || 'ambicaweddingplanner').replace(/^@/, '')}/`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ambica Wedding Planner Instagram"
              >
                ◉
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Ambica Decorators. All Rights Reserved.</span>
            <span>{data?.settings?.phone || '982534**** / 926534****'} • {data?.settings?.email || 'decorambica@gmail.com'}</span>
            <span>
              Idar, Gujarat • Udaipur & Rajsamand, Rajasthan
            </span>
          </div>
        </footer>
      </div>

      <EnquiryModal
        open={enquiryOpen}
        onClose={closeEnquiry}
        preselectedService={preselectedService}
      />

      {loading && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            pointerEvents: 'none',
          }}
        />
      )}
    </>
  );
}
