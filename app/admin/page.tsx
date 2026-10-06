'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type Tab =
    | 'Dashboard'
    | 'Enquiries'
    | 'Our Work'
    | 'Reviews'
    | 'Services'
    | 'Locations'
    | 'FAQs'
    | 'Settings';

type Row = Record<string, any>;

const tabs: Tab[] = [
    'Dashboard',
    'Enquiries',
    'Our Work',
    'Reviews',
    'Services',
    'Locations',
    'FAQs',
    'Settings',
];

const statuses = [
    'NEW',
    'CONTACTED',
    'DISCUSSION',
    'QUOTATION_SENT',
    'CONFIRMED',
    'CLOSED',
];

const eventTypes = [
    'Wedding',
    'Reception',
    'Engagement',
    'Sangeet',
    'Haldi',
    'Mehendi',
    'Corporate & Government Event',
    'Birthday',
    'Navratri',
    'Other',
];

const servicesList = [
    'Wedding Decoration',
    'Wedding Planning',
    'Event Management',
    'Wedding Designing',
    'Event Setup',
    'Venue Décor',
];

async function api(
    url: string,
    options: RequestInit = {}
) {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.error || 'Request failed'
        );
    }

    return data?.data ?? data;
}

/* =========================================================
   SHARED COMPONENTS
   ========================================================= */

function Modal({
    title,
    onClose,
    children,
}: {
    title: string;
    onClose: () => void;
    children: ReactNode;
}) {
    return (
        <div className="admin-modal-backdrop">
            <div className="admin-modal">
                <div className="admin-modal-head">
                    <h2>{title}</h2>

                    <button
                        className="admin-modal-close"
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}

function Field({
    label,
    children,
    wide = false,
}: {
    label: string;
    children: ReactNode;
    wide?: boolean;
}) {
    return (
        <label className={wide ? 'field wide' : 'field'}>
            <span>{label}</span>
            {children}
        </label>
    );
}

function Toggle({
    value,
    onChange,
}: {
    value: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <button
            type="button"
            className={value ? 'toggle on' : 'toggle'}
            onClick={() => onChange(!value)}
            aria-label={value ? 'Enabled' : 'Disabled'}
        >
            <span />
        </button>
    );
}

function Empty({ text }: { text: string }) {
    return <div className="empty">{text}</div>;
}

function PageHead({
    eyebrow,
    title,
    sub,
    action,
}: {
    eyebrow: string;
    title: string;
    sub: string;
    action?: ReactNode;
}) {
    return (
        <div className="page-head">
            <div>
                <div className="eyebrow">{eyebrow}</div>
                <h1>{title}</h1>
                <p>{sub}</p>
            </div>

            {action}
        </div>
    );
}

/* =========================================================
   MAIN ADMIN
   ========================================================= */

export default function Admin() {
    const [tab, setTab] = useState<Tab>('Dashboard');

    const [data, setData] = useState<
        Record<string, Row[]>
    >({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [modal, setModal] = useState<string | null>(
        null
    );

    const [editing, setEditing] = useState<Row | null>(
        null
    );

    const [saving, setSaving] = useState(false);

    const load = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await api('/api/admin/dashboard');

            setData(data);
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : 'Unable to load admin data.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const counts = useMemo(
        () => ({
            enquiries: data.enquiries?.length || 0,
            projects: data.projects?.length || 0,
            reviews: data.reviews?.length || 0,
            services: data.services?.length || 0,
            locations: data.locations?.length || 0,
            faqs: data.faqs?.length || 0,
        }),
        [data]
    );

    const open = (type: string, row?: Row) => {
        setEditing(row || null);
        setModal(type);
    };

    const close = () => {
        setModal(null);
        setEditing(null);
    };

    const save = async (
        path: string,
        body: Row,
        id?: string
    ) => {
        setSaving(true);

        try {
            await api(
                id ? `${path}/${id}` : path,
                {
                    method: id ? 'PATCH' : 'POST',
                    body: JSON.stringify(body),
                }
            );

            close();
            await load();
        } catch (e) {
            alert(
                e instanceof Error
                    ? e.message
                    : 'Unable to save changes.'
            );
        } finally {
            setSaving(false);
        }
    };

    const remove = async (
        path: string,
        id: string
    ) => {
        if (
            !confirm(
                'Delete this item? This cannot be undone.'
            )
        ) {
            return;
        }

        try {
            await api(`${path}/${id}`, {
                method: 'DELETE',
            });

            await load();
        } catch (e) {
            alert(
                e instanceof Error
                    ? e.message
                    : 'Unable to delete item.'
            );
        }
    };

    const logout = async () => {
        await fetch('/api/auth/logout', {
            method: 'POST',
        });

        window.location.href = '/login';
    };

    return (
        <div className="admin-shell">
            {/* =================================================
          HEADER
      ================================================== */}

            <header className="top">
                <div className="brand-wrap">
                    <img
                        src="/assets/logo-purple.png"
                        alt="Ambica Decorators"
                    />

                    <div>
                        <div className="brand">
                            Ambica Decorators
                        </div>

                        <div className="brand-sub">
                            Admin Studio
                        </div>
                    </div>
                </div>

                <div className="top-actions">
                    <span className="live-dot">
                        ● Live CMS
                    </span>

                    <button
                        className="btn secondary"
                        type="button"
                        onClick={logout}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* =================================================
          LAYOUT
      ================================================== */}

            <div className="admin-layout">
                <aside className="side">
                    {tabs.map((item, index) => (
                        <button
                            key={item}
                            type="button"
                            className={
                                tab === item
                                    ? 'nav-item active'
                                    : 'nav-item'
                            }
                            onClick={() => setTab(item)}
                        >
                            <span className="nav-icon">
                                {
                                    [
                                        '⌂',
                                        '✉',
                                        '◇',
                                        '★',
                                        '✦',
                                        '⌖',
                                        '?',
                                        '⚙',
                                    ][index]
                                }
                            </span>

                            {item}
                        </button>
                    ))}
                </aside>

                <main className="main">
                    {error && (
                        <div className="alert">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="loading">
                            Loading your CMS…
                        </div>
                    ) : (
                        <>
                            {tab === 'Dashboard' && (
                                <Dashboard
                                    counts={counts}
                                    data={data}
                                    setTab={setTab}
                                />
                            )}

                            {tab === 'Enquiries' && (
                                <Enquiries
                                    rows={data.enquiries || []}
                                    refresh={load}
                                />
                            )}

                            {tab === 'Our Work' && (
                                <Projects
                                    rows={data.projects || []}
                                    open={open}
                                    remove={remove}
                                />
                            )}

                            {tab === 'Reviews' && (
                                <Reviews
                                    rows={data.reviews || []}
                                    open={open}
                                    remove={remove}
                                />
                            )}

                            {tab === 'Services' && (
                                <Services
                                    rows={data.services || []}
                                    open={open}
                                    remove={remove}
                                />
                            )}

                            {tab === 'Locations' && (
                                <Locations
                                    rows={data.locations || []}
                                    open={open}
                                    remove={remove}
                                />
                            )}

                            {tab === 'FAQs' && (
                                <FAQs
                                    rows={data.faqs || []}
                                    open={open}
                                    remove={remove}
                                />
                            )}

                            {tab === 'Settings' && (
                                <Settings
                                    rows={data.settings || []}
                                    refresh={load}
                                />
                            )}
                        </>
                    )}
                </main>
            </div>

            {/* =================================================
          MODALS
      ================================================== */}

            {modal === 'project' && (
                <ProjectModal
                    row={editing}
                    busy={saving}
                    close={close}
                    save={save}
                />
            )}

            {modal === 'review' && (
                <ReviewModal
                    row={editing}
                    busy={saving}
                    close={close}
                    save={save}
                />
            )}

            {modal === 'service' && (
                <ServiceModal
                    row={editing}
                    busy={saving}
                    close={close}
                    save={save}
                />
            )}

            {modal === 'location' && (
                <LocationModal
                    row={editing}
                    busy={saving}
                    close={close}
                    save={save}
                />
            )}

            {modal === 'faq' && (
                <FAQModal
                    row={editing}
                    busy={saving}
                    close={close}
                    save={save}
                />
            )}
        </div>
    );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
    counts,
    data,
    setTab,
}: {
    counts: any;
    data: Record<string, Row[]>;
    setTab: (tab: Tab) => void;
}) {
    const recent = (
        data.enquiries || []
    ).slice(0, 5);

    return (
        <>
            <PageHead
                eyebrow="Control centre"
                title="Good afternoon."
                sub="Manage the content and enquiries that power the Ambica Decorators website."
            />

            <div className="stat-grid">
                {[
                    [
                        'Enquiries',
                        counts.enquiries,
                        '✉',
                        'Enquiries',
                    ],
                    [
                        'Our Work',
                        counts.projects,
                        '◇',
                        'Our Work',
                    ],
                    [
                        'Reviews',
                        counts.reviews,
                        '★',
                        'Reviews',
                    ],
                    [
                        'Services',
                        counts.services,
                        '✦',
                        'Services',
                    ],
                    [
                        'Locations',
                        counts.locations,
                        '⌖',
                        'Locations',
                    ],
                    [
                        'FAQs',
                        counts.faqs,
                        '?',
                        'FAQs',
                    ],
                ].map(([label, count, icon, target]) => (
                    <button
                        className="stat-card"
                        key={String(label)}
                        type="button"
                        onClick={() =>
                            setTab(target as Tab)
                        }
                    >
                        <span className="stat-icon">
                            {icon}
                        </span>

                        <span className="stat-label">
                            {label}
                        </span>

                        <strong>{count}</strong>

                        <span className="stat-link">
                            Manage →
                        </span>
                    </button>
                ))}
            </div>

            <div className="two-col">
                <section className="panel">
                    <div className="panel-head">
                        <div>
                            <h2>Recent enquiries</h2>

                            <p>
                                Latest client requests from the
                                website.
                            </p>
                        </div>

                        <button
                            className="text-btn"
                            type="button"
                            onClick={() =>
                                setTab('Enquiries')
                            }
                        >
                            View all →
                        </button>
                    </div>

                    {recent.length ? (
                        <div className="mini-list">
                            {recent.map((row) => (
                                <div
                                    className="mini-row"
                                    key={row.id}
                                >
                                    <div className="avatar">
                                        {row.fullName?.slice(0, 1) ||
                                            'A'}
                                    </div>

                                    <div className="mini-main">
                                        <strong>
                                            {row.fullName}
                                        </strong>

                                        <span>
                                            {row.city ||
                                                'Location not provided'}
                                            {' · '}
                                            {row.eventTypes?.join(
                                                ', '
                                            ) ||
                                                'Event enquiry'}
                                        </span>
                                    </div>

                                    <span className="pill">
                                        {String(
                                            row.status || 'NEW'
                                        ).replace('_', ' ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Empty text="No enquiries yet." />
                    )}
                </section>

                <section className="panel feature">
                    <div className="feature-mark">
                        ✦
                    </div>

                    <div>
                        <div className="eyebrow">
                            Brand reminder
                        </div>

                        <h2>
                            45+ years of experience
                        </h2>

                        <p>
                            Keep this heritage statement as
                            the single longevity claim on the
                            public website.
                        </p>
                    </div>
                </section>
            </div>
        </>
    );
}

/* =========================================================
   ENQUIRIES
========================================================= */

function Enquiries({
    rows,
    refresh,
}: {
    rows: Row[];
    refresh: () => void;
}) {
    const [selected, setSelected] =
        useState<Row | null>(null);

    const [filter, setFilter] =
        useState('ALL');

    const visible =
        filter === 'ALL'
            ? rows
            : rows.filter(
                (row) => row.status === filter
            );

    const update = async (
        id: string,
        body: Row
    ) => {
        try {
            await api(
                `/api/enquiries/${id}`,
                {
                    method: 'PATCH',
                    body: JSON.stringify(body),
                }
            );

            setSelected(null);
            refresh();
        } catch (e) {
            alert(
                e instanceof Error
                    ? e.message
                    : 'Unable to update enquiry.'
            );
        }
    };

    return (
        <>
            <PageHead
                eyebrow="Client pipeline"
                title="Enquiries"
                sub="Every request submitted through your website, in one place."
            />

            <div className="toolbar">
                <div className="filters">
                    <button
                        type="button"
                        className={
                            filter === 'ALL'
                                ? 'filter active'
                                : 'filter'
                        }
                        onClick={() =>
                            setFilter('ALL')
                        }
                    >
                        All <b>{rows.length}</b>
                    </button>

                    {statuses.map((status) => (
                        <button
                            key={status}
                            type="button"
                            className={
                                filter === status
                                    ? 'filter active'
                                    : 'filter'
                            }
                            onClick={() =>
                                setFilter(status)
                            }
                        >
                            {status.replace('_', ' ')}{' '}
                            <b>
                                {
                                    rows.filter(
                                        (row) =>
                                            row.status === status
                                    ).length
                                }
                            </b>
                        </button>
                    ))}
                </div>
            </div>

            <div className="panel table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Client</th>
                            <th>Event</th>
                            <th>Dates</th>
                            <th>Guests</th>
                            <th>Status</th>
                            <th />
                        </tr>
                    </thead>

                    <tbody>
                        {visible.map((row) => (
                            <tr key={row.id}>
                                <td>
                                    <strong>
                                        {row.fullName}
                                    </strong>

                                    <small>
                                        {row.phone}
                                        {row.city
                                            ? ` · ${row.city}`
                                            : ''}
                                    </small>
                                </td>

                                <td>
                                    {row.eventTypes?.join(
                                        ', '
                                    ) || '—'}
                                </td>

                                <td>
                                    {row.eventDates?.length
                                        ? row.eventDates
                                            .map(
                                                (date: string) =>
                                                    new Date(
                                                        date
                                                    ).toLocaleDateString(
                                                        'en-IN',
                                                        {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        }
                                                    )
                                            )
                                            .join(', ')
                                        : '—'}
                                </td>

                                <td>
                                    {row.guestCount || '—'}
                                </td>

                                <td>
                                    <span className="pill">
                                        {String(
                                            row.status || 'NEW'
                                        ).replace('_', ' ')}
                                    </span>
                                </td>

                                <td>
                                    <button
                                        className="small-btn"
                                        type="button"
                                        onClick={() =>
                                            setSelected(row)
                                        }
                                    >
                                        Open
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {!visible.length && (
                    <Empty text="No enquiries match this filter." />
                )}
            </div>

            {selected && (
                <Modal
                    title="Enquiry details"
                    onClose={() =>
                        setSelected(null)
                    }
                >
                    <div className="detail-grid">
                        <div>
                            <span>Client</span>
                            <strong>
                                {selected.fullName}
                            </strong>
                        </div>

                        <div>
                            <span>Phone</span>
                            <strong>
                                {selected.phone}
                            </strong>
                        </div>

                        <div>
                            <span>WhatsApp</span>
                            <strong>
                                {selected.whatsapp || '—'}
                            </strong>
                        </div>

                        <div>
                            <span>Email</span>
                            <strong>
                                {selected.email || '—'}
                            </strong>
                        </div>

                        <div>
                            <span>City</span>
                            <strong>
                                {selected.city || '—'}
                            </strong>
                        </div>

                        <div>
                            <span>Venue</span>
                            <strong>
                                {selected.venue || '—'}
                            </strong>
                        </div>

                        <div>
                            <span>Guests</span>
                            <strong>
                                {selected.guestCount || '—'}
                            </strong>
                        </div>

                        <div>
                            <span>Venue finalized?</span>
                            <strong>
                                {selected.venueFinalized ||
                                    'DISCUSSION'}
                            </strong>
                        </div>
                    </div>

                    <div className="detail-block">
                        <span>Event types</span>
                        <p>
                            {selected.eventTypes?.join(
                                ' · '
                            ) || '—'}
                        </p>
                    </div>

                    <div className="detail-block">
                        <span>Event dates</span>
                        <p>
                            {selected.eventDates?.length
                                ? selected.eventDates
                                    .map(
                                        (date: string) =>
                                            new Date(
                                                date
                                            ).toLocaleDateString(
                                                'en-IN',
                                                {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric',
                                                }
                                            )
                                    )
                                    .join(' · ')
                                : '—'}
                        </p>
                    </div>

                    <div className="detail-block">
                        <span>Services</span>
                        <p>
                            {selected.services?.join(
                                ' · '
                            ) || '—'}
                        </p>
                    </div>

                    <div className="detail-block">
                        <span>Budget</span>
                        <p>
                            {selected.budget || '—'}
                        </p>
                    </div>

                    <div className="detail-block">
                        <span>Client message</span>
                        <p>
                            {selected.message || '—'}
                        </p>
                    </div>

                    <Field label="Pipeline status">
                        <select
                            value={
                                selected.status || 'NEW'
                            }
                            onChange={(event) =>
                                setSelected({
                                    ...selected,
                                    status:
                                        event.target.value,
                                })
                            }
                        >
                            {statuses.map((status) => (
                                <option
                                    key={status}
                                    value={status}
                                >
                                    {status.replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Admin notes">
                        <textarea
                            rows={4}
                            value={
                                selected.adminNotes || ''
                            }
                            onChange={(event) =>
                                setSelected({
                                    ...selected,
                                    adminNotes:
                                        event.target.value,
                                })
                            }
                        />
                    </Field>

                    <div className="modal-actions">
                        <button
                            className="btn secondary"
                            type="button"
                            onClick={() =>
                                setSelected(null)
                            }
                        >
                            Close
                        </button>

                        <button
                            className="btn"
                            type="button"
                            onClick={() =>
                                update(selected.id, {
                                    status: selected.status,
                                    adminNotes:
                                        selected.adminNotes,
                                })
                            }
                        >
                            Save changes
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
}

/* =========================================================
   PROJECTS
========================================================= */

function Projects({
    rows,
    open,
    remove,
}: {
    rows: Row[];
    open: (x: string, r?: Row) => void;
    remove: (p: string, id: string) => void;
}) {
    return (
        <>
            <PageHead
                eyebrow="Portfolio CMS"
                title="Our Work"
                sub="Manage event projects and the galleries shown on the public website."
                action={
                    <button
                        className="btn"
                        type="button"
                        onClick={() => open('project')}
                    >
                        + New project
                    </button>
                }
            />

            <div className="project-grid">
                {rows.map((row) => (
                    <article
                        className="project-card"
                        key={row.id}
                    >
                        <div
                            className="project-image"
                            style={
                                row.coverImage
                                    ? {
                                        backgroundImage: `url(${row.coverImage})`,
                                    }
                                    : undefined
                            }
                        >
                            <span>
                                {row.published
                                    ? 'Published'
                                    : 'Draft'}
                            </span>
                        </div>

                        <div className="project-body">
                            <div className="eyebrow">
                                {row.eventType || 'Event'}
                                {' · '}
                                {row.location ||
                                    'Location not set'}
                            </div>

                            <h3>{row.title}</h3>

                            <p>
                                {row.description ||
                                    'No project description yet.'}
                            </p>

                            <div className="card-actions">
                                <button
                                    className="small-btn"
                                    type="button"
                                    onClick={() =>
                                        open('project', row)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="danger-btn"
                                    type="button"
                                    onClick={() =>
                                        remove(
                                            '/api/projects',
                                            row.id
                                        )
                                    }
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </article>
                ))}

                {!rows.length && (
                    <Empty text="No projects yet. Add your first portfolio project." />
                )}
            </div>
        </>
    );
}

/* =========================================================
   REVIEWS
========================================================= */

function Reviews({
    rows,
    open,
    remove,
}: {
    rows: Row[];
    open: (x: string, r?: Row) => void;
    remove: (p: string, id: string) => void;
}) {
    return (
        <>
            <PageHead
                eyebrow="Social proof"
                title="Reviews"
                sub="Keep testimonials fresh, accurate and publication-ready."
                action={
                    <button
                        className="btn"
                        type="button"
                        onClick={() => open('review')}
                    >
                        + New review
                    </button>
                }
            />

            <div className="review-grid">
                {rows.map((row) => (
                    <article
                        className="quote-card"
                        key={row.id}
                    >
                        <div className="stars">
                            {'★'.repeat(
                                Math.min(
                                    5,
                                    Math.max(0, row.rating || 5)
                                )
                            )}
                        </div>

                        <p>“{row.text}”</p>

                        <strong>
                            {row.clientName}
                        </strong>

                        <small>
                            {[
                                row.eventType,
                                row.location,
                            ]
                                .filter(Boolean)
                                .join(' · ') ||
                                'Client testimonial'}
                        </small>

                        <div className="card-actions">
                            <span className="pill">
                                {row.published
                                    ? 'Published'
                                    : 'Hidden'}
                            </span>

                            <button
                                className="small-btn"
                                type="button"
                                onClick={() =>
                                    open('review', row)
                                }
                            >
                                Edit
                            </button>

                            <button
                                className="danger-btn"
                                type="button"
                                onClick={() =>
                                    remove(
                                        '/api/reviews',
                                        row.id
                                    )
                                }
                            >
                                Delete
                            </button>
                        </div>
                    </article>
                ))}

                {!rows.length && (
                    <Empty text="No reviews yet." />
                )}
            </div>
        </>
    );
}

/* =========================================================
   SERVICES
========================================================= */

function Services({
    rows,
    open,
    remove,
}: {
    rows: Row[];
    open: (x: string, r?: Row) => void;
    remove: (p: string, id: string) => void;
}) {
    return (
        <>
            <PageHead
                eyebrow="Offerings"
                title="Services"
                sub="Control the services clients can discover and select in enquiries."
                action={
                    <button
                        className="btn"
                        type="button"
                        onClick={() => open('service')}
                    >
                        + New service
                    </button>
                }
            />

            <div className="panel table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Description</th>
                            <th>Visibility</th>
                            <th>Order</th>
                            <th />
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.id}>
                                <td>
                                    <strong>
                                        {row.name}
                                    </strong>
                                </td>

                                <td>
                                    {row.description || '—'}
                                </td>

                                <td>
                                    <span className="pill">
                                        {row.published
                                            ? 'Published'
                                            : 'Hidden'}
                                    </span>
                                </td>

                                <td>
                                    {row.sortOrder ?? 0}
                                </td>

                                <td className="actions">
                                    <button
                                        className="small-btn"
                                        type="button"
                                        onClick={() =>
                                            open('service', row)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="danger-btn"
                                        type="button"
                                        onClick={() =>
                                            remove(
                                                '/api/services',
                                                row.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {!rows.length && (
                    <Empty text="No services yet." />
                )}
            </div>
        </>
    );
}

/* =========================================================
   LOCATIONS
========================================================= */

function Locations({
    rows,
    open,
    remove,
}: {
    rows: Row[];
    open: (x: string, r?: Row) => void;
    remove: (p: string, id: string) => void;
}) {
    return (
        <>
            <PageHead
                eyebrow="Service footprint"
                title="Locations"
                sub="Show where Ambica Decorators serves clients across Gujarat and Rajasthan."
                action={
                    <button
                        className="btn"
                        type="button"
                        onClick={() => open('location')}
                    >
                        + New location
                    </button>
                }
            />

            <div className="location-grid">
                {rows.map((row) => (
                    <article
                        className="location-card"
                        key={row.id}
                    >
                        <div className="location-pin">
                            ⌖
                        </div>

                        <div>
                            <div className="eyebrow">
                                {row.state || 'India'}
                            </div>

                            <h3>{row.name}</h3>

                            <p>
                                {row.description ||
                                    'Add a short service-area description.'}
                            </p>
                        </div>

                        <div className="card-actions">
                            <span className="pill">
                                {row.published
                                    ? 'Published'
                                    : 'Hidden'}
                            </span>

                            <button
                                className="small-btn"
                                type="button"
                                onClick={() =>
                                    open('location', row)
                                }
                            >
                                Edit
                            </button>

                            <button
                                className="danger-btn"
                                type="button"
                                onClick={() =>
                                    remove(
                                        '/api/locations',
                                        row.id
                                    )
                                }
                            >
                                Delete
                            </button>
                        </div>
                    </article>
                ))}

                {!rows.length && (
                    <Empty text="No locations yet." />
                )}
            </div>
        </>
    );
}

/* =========================================================
   FAQS
========================================================= */

function FAQs({
    rows,
    open,
    remove,
}: {
    rows: Row[];
    open: (x: string, r?: Row) => void;
    remove: (p: string, id: string) => void;
}) {
    return (
        <>
            <PageHead
                eyebrow="Client questions"
                title="FAQs"
                sub="Answer common planning questions before clients need to ask."
                action={
                    <button
                        className="btn"
                        type="button"
                        onClick={() => open('faq')}
                    >
                        + New FAQ
                    </button>
                }
            />

            <div className="faq-list">
                {rows.map((row, index) => (
                    <article
                        className="faq-card"
                        key={row.id}
                    >
                        <span className="faq-no">
                            {String(index + 1).padStart(
                                2,
                                '0'
                            )}
                        </span>

                        <div>
                            <h3>{row.question}</h3>

                            <p>{row.answer}</p>
                        </div>

                        <div className="card-actions">
                            <span className="pill">
                                {row.published
                                    ? 'Published'
                                    : 'Hidden'}
                            </span>

                            <button
                                className="small-btn"
                                type="button"
                                onClick={() =>
                                    open('faq', row)
                                }
                            >
                                Edit
                            </button>

                            <button
                                className="danger-btn"
                                type="button"
                                onClick={() =>
                                    remove(
                                        '/api/faqs',
                                        row.id
                                    )
                                }
                            >
                                Delete
                            </button>
                        </div>
                    </article>
                ))}

                {!rows.length && (
                    <Empty text="No FAQs yet." />
                )}
            </div>
        </>
    );
}

/* =========================================================
   SETTINGS
========================================================= */

function Settings({
    rows,
    refresh,
}: {
    rows: Row[];
    refresh: () => void;
}) {
    const initial = Object.fromEntries(
        rows.map((row) => [
            row.key,
            row.value,
        ])
    );

    const [form, setForm] =
        useState<Record<string, string>>(
            initial
        );

    useEffect(() => {
        setForm(initial);
    }, [rows]);

    const keys = [
        ['phone', 'Primary phone / calls'],
        ['whatsapp', 'WhatsApp number'],
        ['email', 'Business email'],
        [
            'instagram_primary',
            'Instagram handle 1',
        ],
        [
            'instagram_secondary',
            'Instagram handle 2',
        ],
        [
            'service_radius',
            'Service radius claim',
        ],
        [
            'heritage_statement',
            'Heritage statement',
        ],
    ];

    const save = async (key: string) => {
        try {
            await api('/api/settings', {
                method: 'PUT',
                body: JSON.stringify({
                    key,
                    value: form[key] || '',
                }),
            });

            refresh();
            alert('Saved');
        } catch (e) {
            alert(
                e instanceof Error
                    ? e.message
                    : 'Unable to save setting.'
            );
        }
    };

    return (
        <>
            <PageHead
                eyebrow="Website configuration"
                title="Settings"
                sub="Update contact and brand information without touching code."
            />

            <div className="settings-grid">
                {keys.map(([key, label]) => (
                    <div
                        className="setting-card"
                        key={key}
                    >
                        <Field label={label}>
                            <input
                                value={form[key] || ''}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        [key]:
                                            event.target.value,
                                    })
                                }
                            />
                        </Field>

                        <button
                            className="small-btn"
                            type="button"
                            onClick={() => save(key)}
                        >
                            Save
                        </button>
                    </div>
                ))}
            </div>

            <div className="panel notice">
                <div className="eyebrow">
                    Coming in media phase
                </div>

                <h2>
                    Cloudinary media library
                </h2>

                <p>
                    The portfolio data model already
                    supports multiple project photos.
                    The next media step will add secure
                    uploads, ordering, alt text and
                    cover-image selection.
                </p>
            </div>
        </>
    );
}

/* =========================================================
   PROJECT MODAL
========================================================= */

function ProjectModal({
    row,
    busy,
    close,
    save,
}: {
    row: Row | null;
    busy: boolean;
    close: () => void;
    save: (
        p: string,
        b: Row,
        id?: string
    ) => void;
}) {
    const [form, setForm] = useState({
        title: row?.title || '',
        slug: row?.slug || '',
        eventType:
            row?.eventType || 'Wedding',
        location: row?.location || '',
        description:
            row?.description || '',
        coverImage:
            row?.coverImage || '',
        published:
            row?.published ?? true,
    });

    return (
        <Modal
            title={
                row
                    ? 'Edit project'
                    : 'New project'
            }
            onClose={close}
        >
            <form
                onSubmit={(event) => {
                    event.preventDefault();

                    save(
                        '/api/projects',
                        form,
                        row?.id
                    );
                }}
            >
                <div className="form-grid">
                    <Field label="Project title">
                        <input
                            required
                            value={form.title}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    title:
                                        event.target.value,
                                })
                            }
                        />
                    </Field>

                    <Field label="Slug">
                        <input
                            required
                            value={form.slug}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    slug:
                                        event.target.value,
                                })
                            }
                        />
                    </Field>

                    <Field label="Event type">
                        <select
                            value={form.eventType}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    eventType:
                                        event.target.value,
                                })
                            }
                        >
                            {eventTypes.map((type) => (
                                <option
                                    key={type}
                                    value={type}
                                >
                                    {type}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Location">
                        <input
                            required
                            value={form.location}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    location:
                                        event.target.value,
                                })
                            }
                        />
                    </Field>

                    <Field
                        label="Cover image URL"
                        wide
                    >
                        <input
                            value={form.coverImage}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    coverImage:
                                        event.target.value,
                                })
                            }
                            placeholder="Cloudinary URL — upload integration comes next"
                        />
                    </Field>

                    <Field
                        label="Description"
                        wide
                    >
                        <textarea
                            rows={4}
                            value={form.description}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    description:
                                        event.target.value,
                                })
                            }
                        />
                    </Field>
                </div>

                <div className="inline-setting">
                    <span>Published</span>

                    <Toggle
                        value={form.published}
                        onChange={(value) =>
                            setForm({
                                ...form,
                                published: value,
                            })
                        }
                    />
                </div>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="btn secondary"
                        onClick={close}
                    >
                        Cancel
                    </button>

                    <button
                        className="btn"
                        disabled={busy}
                    >
                        {busy
                            ? 'Saving…'
                            : 'Save project'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

/* =========================================================
   REVIEW MODAL
========================================================= */

function ReviewModal({
    row,
    busy,
    close,
    save,
}: {
    row: Row | null;
    busy: boolean;
    close: () => void;
    save: (
        p: string,
        b: Row,
        id?: string
    ) => void;
}) {
    const [form, setForm] = useState({
        clientName:
            row?.clientName || '',
        eventType:
            row?.eventType || '',
        location:
            row?.location || '',
        text: row?.text || '',
        rating: row?.rating ?? 5,
        published:
            row?.published ?? true,
    });

    return (
        <Modal
            title={
                row
                    ? 'Edit review'
                    : 'New review'
            }
            onClose={close}
        >
            <form
                onSubmit={(event) => {
                    event.preventDefault();

                    save(
                        '/api/reviews',
                        form,
                        row?.id
                    );
                }}
            >
                <div className="form-grid">
                    <Field label="Client name">
                        <input
                            required
                            value={form.clientName}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    clientName:
                                        event.target.value,
                                })
                            }
                        />
                    </Field>

                    <Field label="Rating">
                        <select
                            value={form.rating}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    rating: Number(
                                        event.target.value
                                    ),
                                })
                            }
                        >
                            {[5, 4, 3, 2, 1].map(
                                (rating) => (
                                    <option
                                        key={rating}
                                        value={rating}
                                    >
                                        {rating}
                                    </option>
                                )
                            )}
                        </select>
                    </Field>

                    <Field label="Event type">
                        <input
                            value={form.eventType}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    eventType:
                                        event.target.value,
                                })
                            }
                        />
                    </Field>

                    <Field label="Location">
                        <input
                            value={form.location}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    location:
                                        event.target.value,
                                })
                            }
                        />
                    </Field>

                    <Field
                        label="Review"
                        wide
                    >
                        <textarea
                            required
                            rows={5}
                            value={form.text}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    text:
                                        event.target.value,
                                })
                            }
                        />
                    </Field>
                </div>

                <div className="inline-setting">
                    <span>Published</span>

                    <Toggle
                        value={form.published}
                        onChange={(value) =>
                            setForm({
                                ...form,
                                published: value,
                            })
                        }
                    />
                </div>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="btn secondary"
                        onClick={close}
                    >
                        Cancel
                    </button>

                    <button
                        className="btn"
                        disabled={busy}
                    >
                        {busy
                            ? 'Saving…'
                            : 'Save review'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

/* =========================================================
   SERVICE MODAL
========================================================= */

function ServiceModal({
    row,
    busy,
    close,
    save,
}: {
    row: Row | null;
    busy: boolean;
    close: () => void;
    save: (
        p: string,
        b: Row,
        id?: string
    ) => void;
}) {
    const [form, setForm] = useState({
        name: row?.name || '',
        description:
            row?.description || '',
        image: row?.image || '',
        published:
            row?.published ?? true,
        sortOrder:
            row?.sortOrder ?? 0,
    });

    return (
        <Modal
            title={
                row
                    ? 'Edit service'
                    : 'New service'
            }
            onClose={close}
        >
            <form
                onSubmit={(event) => {
                    event.preventDefault();

                    save(
                        '/api/services',
                        form,
                        row?.id
                    );
                }}
            >
                <Field label="Service name">
                    <input
                        required
                        value={form.name}
                        onChange={(event) =>
                            setForm({
                                ...form,
                                name:
                                    event.target.value,
                            })
                        }
                    />
                </Field>

                <Field label="Description">
                    <textarea
                        rows={4}
                        value={form.description}
                        onChange={(event) =>
                            setForm({
                                ...form,
                                description:
                                    event.target.value,
                            })
                        }
                    />
                </Field>

                <Field label="Image URL">
                    <input
                        value={form.image}
                        onChange={(event) =>
                            setForm({
                                ...form,
                                image:
                                    event.target.value,
                            })
                        }
                    />
                </Field>

                <Field label="Display order">
                    <input
                        type="number"
                        min="0"
                        value={form.sortOrder}
                        onChange={(event) =>
                            setForm({
                                ...form,
                                sortOrder: Number(
                                    event.target.value
                                ),
                            })
                        }
                    />
                </Field>

                <div className="inline-setting">
                    <span>Published</span>

                    <Toggle
                        value={form.published}
                        onChange={(value) =>
                            setForm({
                                ...form,
                                published: value,
                            })
                        }
                    />
                </div>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="btn secondary"
                        onClick={close}
                    >
                        Cancel
                    </button>

                    <button
                        className="btn"
                        disabled={busy}
                    >
                        {busy
                            ? 'Saving…'
                            : 'Save service'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

/* =========================================================
   LOCATION MODAL
========================================================= */

function LocationModal({
    row,
    busy,
    close,
    save,
}: {
    row: Row | null;
    busy: boolean;
    close: () => void;
    save: (
        p: string,
        b: Row,
        id?: string
    ) => void;
}) {
    const [form, setForm] = useState({
        name: row?.name || '',
        state:
            row?.state || 'Gujarat',
        description:
            row?.description || '',
        published:
            row?.published ?? true,
        sortOrder:
            row?.sortOrder ?? 0,
    });

    return (
        <Modal
            title={
                row
                    ? 'Edit location'
                    : 'New location'
            }
            onClose={close}
        >
            <form
                onSubmit={(event) => {
                    event.preventDefault();

                    save(
                        '/api/locations',
                        form,
                        row?.id
                    );
                }}
            >
                <Field label="Location / area">
                    <input
                        required
                        value={form.name}
                        onChange={(event) =>
                            setForm({
                                ...form,
                                name:
                                    event.target.value,
                            })
                        }
                    />
                </Field>

                <Field label="State">
                    <select
                        value={form.state}
                        onChange={(event) =>
                            setForm({
                                ...form,
                                state:
                                    event.target.value,
                            })
                        }
                    >
                        <option value="Gujarat">
                            Gujarat
                        </option>

                        <option value="Rajasthan">
                            Rajasthan
                        </option>

                        <option value="Other">
                            Other
                        </option>
                    </select>
                </Field>

                <Field label="Description">
                    <textarea
                        rows={4}
                        value={form.description}
                        onChange={(event) =>
                            setForm({
                                ...form,
                                description:
                                    event.target.value,
                            })
                        }
                    />
                </Field>

                <Field label="Display order">
                    <input
                        type="number"
                        min="0"
                        value={form.sortOrder}
                        onChange={(event) =>
                            setForm({
                                ...form,
                                sortOrder: Number(
                                    event.target.value
                                ),
                            })
                        }
                    />
                </Field>

                <div className="inline-setting">
                    <span>Published</span>

                    <Toggle
                        value={form.published}
                        onChange={(value) =>
                            setForm({
                                ...form,
                                published: value,
                            })
                        }
                    />
                </div>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="btn secondary"
                        onClick={close}
                    >
                        Cancel
                    </button>

                    <button
                        className="btn"
                        disabled={busy}
                    >
                        {busy
                            ? 'Saving…'
                            : 'Save location'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

/* =========================================================
   FAQ MODAL
========================================================= */

function FAQModal({
    row,
    busy,
    close,
    save,
}: {
    row: Row | null;
    busy: boolean;
    close: () => void;
    save: (
        p: string,
        b: Row,
        id?: string
    ) => void;
}) {
    const [form, setForm] = useState({
        question:
            row?.question || '',
        answer: row?.answer || '',
        published:
            row?.published ?? true,
        sortOrder:
            row?.sortOrder ?? 0,
    });

    return (
        <Modal
            title={
                row
                    ? 'Edit FAQ'
                    : 'New FAQ'
            }
            onClose={close}
        >
            <form
                onSubmit={(event) => {
                    event.preventDefault();

                    save(
                        '/api/faqs',
                        form,
                        row?.id
                    );
                }}
            >
                <Field label="Question">
                    <input
                        required
                        value={form.question}
                        onChange={(event) =>
                            setForm({
                                ...form,
                                question:
                                    event.target.value,
                            })
                        }
                    />
                </Field>

                <Field label="Answer">
                    <textarea
                        required
                        rows={6}
                        value={form.answer}
                        onChange={(event) =>
                            setForm({
                                ...form,
                                answer:
                                    event.target.value,
                            })
                        }
                    />
                </Field>

                <Field label="Display order">
                    <input
                        type="number"
                        min="0"
                        value={form.sortOrder}
                        onChange={(event) =>
                            setForm({
                                ...form,
                                sortOrder: Number(
                                    event.target.value
                                ),
                            })
                        }
                    />
                </Field>

                <div className="inline-setting">
                    <span>Published</span>

                    <Toggle
                        value={form.published}
                        onChange={(value) =>
                            setForm({
                                ...form,
                                published: value,
                            })
                        }
                    />
                </div>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="btn secondary"
                        onClick={close}
                    >
                        Cancel
                    </button>

                    <button
                        className="btn"
                        disabled={busy}
                    >
                        {busy
                            ? 'Saving…'
                            : 'Save FAQ'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}