'use client';

import { useEffect, useState } from 'react';

type EnquiryModalProps = {
  open: boolean;
  onClose: () => void;
  preselectedService?: string | null;
};

const EVENT_TYPES = [
  'Wedding',
  'Reception',
  'Engagement',
  'Haldi',
  'Mehendi',
  'Sangeet',
  'Corporate Event',
  'Birthday',
  'Other',
];

const SERVICES = [
  'Wedding Decoration',
  'Wedding Planning',
  'Event Management',
  'Wedding Designing',
  'Event Setup',
  'Venue Décor',
];

type FormData = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  venue: string;
  guestCount: string;
  eventTypes: string[];
  eventDates: string[];
  services: string[];
  budget: string;
  venueFinalized: 'YES' | 'NO' | 'DISCUSSION';
  message: string;
};

const initialForm: FormData = {
  fullName: '',
  phone: '',
  email: '',
  city: '',
  venue: '',
  guestCount: '',
  eventTypes: [],
  eventDates: [''],
  services: [],
  budget: '',
  venueFinalized: 'DISCUSSION',
  message: '',
};

export default function EnquiryModal({
  open,
  onClose,
  preselectedService,
}: EnquiryModalProps) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  /*
   * Lock page scrolling while the enquiry modal is open.
   */
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  /*
   * Pre-select a service when the modal is opened
   * from a service card.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    if (preselectedService) {
      setForm((current) => ({
        ...current,
        services: current.services.includes(preselectedService)
          ? current.services
          : [...current.services, preselectedService],
      }));
    }
  }, [open, preselectedService]);

  /*
   * Close the modal with Escape.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const toggleEventType = (eventType: string) => {
    setForm((current) => ({
      ...current,
      eventTypes: current.eventTypes.includes(eventType)
        ? current.eventTypes.filter((item) => item !== eventType)
        : [...current.eventTypes, eventType],
    }));
  };

  const toggleService = (service: string) => {
    setForm((current) => ({
      ...current,
      services: current.services.includes(service)
        ? current.services.filter((item) => item !== service)
        : [...current.services, service],
    }));
  };

  const updateDate = (index: number, value: string) => {
    setForm((current) => {
      const dates = [...current.eventDates];
      dates[index] = value;

      return {
        ...current,
        eventDates: dates,
      };
    });
  };

  const addDate = () => {
    setForm((current) => ({
      ...current,
      eventDates: [...current.eventDates, ''],
    }));
  };

  const removeDate = (index: number) => {
    setForm((current) => {
      if (current.eventDates.length === 1) {
        return current;
      }

      return {
        ...current,
        eventDates: current.eventDates.filter(
          (_, dateIndex) => dateIndex !== index
        ),
      };
    });
  };

  const updateField = (
    field: keyof FormData,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setStatus('');

    if (!form.fullName.trim()) {
      setStatus('Please enter your name.');
      return;
    }

    if (!form.phone.trim()) {
      setStatus('Please enter your phone number.');
      return;
    }

    if (form.eventTypes.length === 0) {
      setStatus('Please select at least one event type.');
      return;
    }

    const validDates = form.eventDates.filter(
      (date) => date.trim() !== ''
    );

    if (validDates.length === 0) {
      setStatus('Please select at least one event date.');
      return;
    }

    if (form.services.length === 0) {
      setStatus('Please select at least one service.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
          city: form.city.trim() || undefined,
          venue: form.venue.trim() || undefined,
          guestCount: form.guestCount
            ? Number(form.guestCount)
            : undefined,
          eventTypes: form.eventTypes,
          eventDates: validDates,
          services: form.services,
          budget: form.budget.trim() || undefined,
          venueFinalized: form.venueFinalized,
          message: form.message.trim() || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || 'Unable to submit your enquiry.'
        );
      }

      setStatus(
        'Thank you! Your enquiry has been received. We will get in touch with you shortly.'
      );

      setForm(initialForm);

      /*
       * Keep the success message visible briefly before
       * closing the modal.
       */
      window.setTimeout(() => {
        onClose();
        setStatus('');
      }, 2500);
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="enquiry-modal open"
      id="enquiryModal"
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
    >
      {/* Backdrop */}
      <div
        className="enquiry-modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="enquiry-modal-card">
        <button
          className="enquiry-modal-close"
          type="button"
          onClick={onClose}
          aria-label="Close enquiry form"
        >
          ×
        </button>

        <div className="enquiry-modal-intro">
          <div className="section-label">
            EVENT ENQUIRY
          </div>

          <h2 id="enquiry-modal-title">
            LET&apos;S CREATE
            <br />
            <em>SOMETHING BEAUTIFUL.</em>
          </h2>

          <p>
            Tell us a little about your event and what you
            have in mind. Our team will connect with you to
            understand your requirements and take things
            forward.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ------------------------------------------------
              YOUR DETAILS
          ------------------------------------------------- */}
          <div className="form-section">
            <h3>YOUR DETAILS</h3>

            <div className="form-grid">
              <label>
                Full Name *
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(event) =>
                    updateField(
                      'fullName',
                      event.target.value
                    )
                  }
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                />
              </label>

              <label>
                Phone / WhatsApp *
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) =>
                    updateField(
                      'phone',
                      event.target.value
                    )
                  }
                  placeholder="Your phone number"
                  autoComplete="tel"
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateField(
                      'email',
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </label>

              <label>
                City
                <input
                  type="text"
                  value={form.city}
                  onChange={(event) =>
                    updateField(
                      'city',
                      event.target.value
                    )
                  }
                  placeholder="City"
                  autoComplete="address-level2"
                />
              </label>
            </div>
          </div>

          {/* ------------------------------------------------
              EVENT DETAILS
          ------------------------------------------------- */}
          <div className="form-section">
            <h3>EVENT DETAILS</h3>

            <label>
              What are you planning?
            </label>

            <div className="checks">
              {EVENT_TYPES.map((eventType) => (
                <label key={eventType}>
                  <input
                    type="checkbox"
                    checked={form.eventTypes.includes(
                      eventType
                    )}
                    onChange={() =>
                      toggleEventType(eventType)
                    }
                  />

                  <span>{eventType}</span>
                </label>
              ))}
            </div>

            <div className="form-grid two">
              <label>
                Venue / Location
                <input
                  type="text"
                  value={form.venue}
                  onChange={(event) =>
                    updateField(
                      'venue',
                      event.target.value
                    )
                  }
                  placeholder="Venue or location"
                />
              </label>

              <label>
                Expected Guests
                <input
                  type="number"
                  min="1"
                  value={form.guestCount}
                  onChange={(event) =>
                    updateField(
                      'guestCount',
                      event.target.value
                    )
                  }
                  placeholder="Approx. guest count"
                />
              </label>
            </div>

            <div className="form-grid two">
              <label>
                Approx. Budget
                <select
                  value={form.budget}
                  onChange={(event) =>
                    updateField(
                      'budget',
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Select budget range
                  </option>
                  <option value="Below ₹2 Lakh">
                    Below ₹2 Lakh
                  </option>
                  <option value="₹2 Lakh – ₹5 Lakh">
                    ₹2 Lakh – ₹5 Lakh
                  </option>
                  <option value="₹5 Lakh – ₹10 Lakh">
                    ₹5 Lakh – ₹10 Lakh
                  </option>
                  <option value="₹10 Lakh – ₹20 Lakh">
                    ₹10 Lakh – ₹20 Lakh
                  </option>
                  <option value="₹20 Lakh+">
                    ₹20 Lakh+
                  </option>
                  <option value="Prefer to discuss">
                    Prefer to discuss
                  </option>
                </select>
              </label>

              <label>
                Is the venue finalized?
                <select
                  value={form.venueFinalized}
                  onChange={(event) =>
                    updateField(
                      'venueFinalized',
                      event.target.value
                    )
                  }
                >
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                  <option value="DISCUSSION">
                    Still discussing
                  </option>
                </select>
              </label>
            </div>
          </div>

          {/* ------------------------------------------------
              EVENT DATES
          ------------------------------------------------- */}
          <div className="form-section">
            <h3>EVENT DATES</h3>

            <p className="hint block">
              Add all the dates related to your event.
            </p>

            <div className="date-list">
              {form.eventDates.map((date, index) => (
                <div className="date-row" key={index}>
                  <input
                    type="date"
                    value={date}
                    onChange={(event) =>
                      updateDate(
                        index,
                        event.target.value
                      )
                    }
                    aria-label={`Event date ${index + 1}`}
                  />

                  {form.eventDates.length > 1 && (
                    <button
                      className="remove-date"
                      type="button"
                      onClick={() =>
                        removeDate(index)
                      }
                      aria-label={`Remove date ${index + 1
                        }`}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              className="add-date"
              type="button"
              onClick={addDate}
            >
              + Add another date
            </button>
          </div>

          {/* ------------------------------------------------
              SERVICES
          ------------------------------------------------- */}
          <div className="form-section">
            <h3>WHAT DO YOU NEED FROM US?</h3>

            <p className="hint block">
              Select all the services you are interested in.
            </p>

            <div className="checks">
              {SERVICES.map((service) => (
                <label key={service}>
                  <input
                    type="checkbox"
                    checked={form.services.includes(
                      service
                    )}
                    onChange={() =>
                      toggleService(service)
                    }
                  />

                  <span>{service}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ------------------------------------------------
              REQUIREMENTS
          ------------------------------------------------- */}
          <div className="form-section">
            <h3>TELL US MORE</h3>

            <label>
              Your vision / requirements
              <textarea
                value={form.message}
                onChange={(event) =>
                  updateField(
                    'message',
                    event.target.value
                  )
                }
                placeholder="Tell us about your vision, theme, colours, requirements, or anything else you would like us to know."
                rows={5}
              />
            </label>
          </div>

          {/* ------------------------------------------------
              SUBMIT
          ------------------------------------------------- */}
          <div className="form-footer">
            <p
              className={
                status.startsWith('Thank you')
                  ? 'success'
                  : ''
              }
              role={status ? 'status' : undefined}
            >
              {status ||
                'We respect your privacy and will only use these details to contact you about your enquiry.'}
            </p>

            <button
              className="btn purple"
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? 'Sending...'
                : 'Submit Enquiry'}
              <span>↗</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}