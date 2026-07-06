/* ═══════════════════════════════════════════
   GYMFIT API — routes/plans.js

   Endpoints:
   GET /api/plans       → get all membership plans
   GET /api/plans/:id   → get one plan by ID
═══════════════════════════════════════════ */

const express = require('express');
const router  = express.Router();

/* ── IN-MEMORY DATA ──────────────────────────
   Same plans shown on the GymFit pricing section.
────────────────────────────────────────── */
const plans = [
  {
    id          : 1,
    name        : 'Starter',
    slug        : 'starter',
    priceMonthly: 2500,
    currency    : 'PKR',
    tagline     : 'Everything you need to begin.',
    popular     : false,
    features    : [
      { text: '8 classes per month',          included: true  },
      { text: 'Gym floor access (6am–10pm)',  included: true  },
      { text: '1 trainer check-in session',   included: true  },
      { text: 'GymFit mobile app',            included: true  },
      { text: 'Unlimited class bookings',     included: false },
      { text: 'Nutrition guidance',           included: false }
    ]
  },
  {
    id          : 2,
    name        : 'Pro',
    slug        : 'pro',
    priceMonthly: 4500,
    currency    : 'PKR',
    tagline     : 'Built for serious progress.',
    popular     : true,
    features    : [
      { text: 'Unlimited class bookings',     included: true  },
      { text: '24/7 gym floor access',        included: true  },
      { text: '4 trainer sessions/month',     included: true  },
      { text: 'GymFit mobile app',            included: true  },
      { text: 'Nutrition guidance',           included: true  },
      { text: 'Personal program design',      included: false }
    ]
  },
  {
    id          : 3,
    name        : 'Elite',
    slug        : 'elite',
    priceMonthly: 7500,
    currency    : 'PKR',
    tagline     : 'Full-service, no compromises.',
    popular     : false,
    features    : [
      { text: 'Unlimited class bookings',     included: true  },
      { text: '24/7 gym floor access',        included: true  },
      { text: 'Unlimited trainer sessions',   included: true  },
      { text: 'GymFit mobile app',            included: true  },
      { text: 'Nutrition guidance',           included: true  },
      { text: 'Personal program design',      included: true  }
    ]
  }
];

/* ════════════════════════════════════════════
   GET /api/plans
   Returns all membership plans.
════════════════════════════════════════════ */
router.get('/', (req, res) => {
  res.status(200).json({
    success : true,
    count   : plans.length,
    data    : plans
  });
});

/* ════════════════════════════════════════════
   GET /api/plans/:id
   Returns a single plan by ID.
   Also supports slug: /api/plans/pro
════════════════════════════════════════════ */
router.get('/:id', (req, res) => {
  const param = req.params.id;

  // Try matching by numeric ID first, then by slug name
  const plan = isNaN(param)
    ? plans.find(p => p.slug === param.toLowerCase())
    : plans.find(p => p.id  === parseInt(param));

  if (!plan) {
    return res.status(404).json({
      success : false,
      error   : `Plan '${param}' not found.`
    });
  }

  res.status(200).json({
    success : true,
    data    : plan
  });
});

module.exports = router;