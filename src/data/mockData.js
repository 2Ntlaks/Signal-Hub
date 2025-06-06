// Mock data for development - will be replaced with Supabase later
export const mockChapters = [
  {
    id: 1,
    title: "Introduction to Signals & Systems",
    description:
      "Fundamental concepts of continuous and discrete signals, system properties and classifications.",
    order: 1,
    materials: {
      notes: "intro_signals_notes.pdf",
      solutions: "intro_signals_solutions.pdf",
      formulas: "intro_signals_formulas.pdf",
    },
    isUnlocked: true,
  },
  {
    id: 2,
    title: "Linear Time-Invariant (LTI) Systems",
    description:
      "Properties of LTI systems, impulse response, convolution, and system analysis.",
    order: 2,
    materials: {
      notes: "lti_systems_notes.pdf",
      solutions: "lti_systems_solutions.pdf",
      formulas: "lti_systems_formulas.pdf",
    },
    isUnlocked: true,
  },
  {
    id: 3,
    title: "Fourier Series Representation",
    description:
      "Periodic signal representation using Fourier series, convergence properties.",
    order: 3,
    materials: {
      notes: "fourier_series_notes.pdf",
      solutions: "fourier_series_solutions.pdf",
    },
    isUnlocked: false,
  },
  {
    id: 4,
    title: "Continuous-Time Fourier Transform",
    description:
      "CTFT properties, frequency domain analysis, and signal processing applications.",
    order: 4,
    materials: {
      notes: "ctft_notes.pdf",
      solutions: "ctft_solutions.pdf",
    },
    isUnlocked: false,
  },
  {
    id: 5,
    title: "The Laplace Transform",
    description:
      "Laplace transform properties, ROC, inverse transforms, and system analysis.",
    order: 5,
    materials: {
      notes: "laplace_notes.pdf",
      solutions: "laplace_solutions.pdf",
    },
    isUnlocked: false,
  },
  {
    id: 6,
    title: "Discrete-Time Signals & Z-Transform",
    description:
      "Discrete signals, Z-transform properties, and digital system analysis.",
    order: 6,
    materials: {
      notes: "ztransform_notes.pdf",
      solutions: "ztransform_solutions.pdf",
    },
    isUnlocked: false,
  },
  {
    id: 7,
    title: "DFT & FFT",
    description:
      "Discrete Fourier Transform, Fast Fourier Transform algorithms and applications.",
    order: 7,
    materials: {
      notes: "dft_fft_notes.pdf",
      solutions: "dft_fft_solutions.pdf",
    },
    isUnlocked: false,
  },
];

export const mockUser = {
  id: 1,
  name: "Ntlakanipho Mgaguli",
  email: "ntlakanipho@student.cput.ac.za",
  tier: "free", // or "premium"
  completedChapters: [1],
  bookmarks: [1, 2],
};
