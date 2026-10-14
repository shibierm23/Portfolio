import { jsPDF } from 'jspdf';

export const resumeData = {
  name: "Shibie R M",
  title: "Frontend Developer",
  contact: {
    phone: "+91 9500309919",
    email: "shibierm23@gmail.com",
  },

  summary: [
    "Frontend Developer with 1+ year of experience building responsive web and mobile applications using React.js, Next.js, TypeScript, React Native, and Tailwind CSS.",
    "Experienced in developing reusable and dynamic frontend components, integrating REST APIs, implementing form validation, and managing frontend data and application states.",
    "Strong foundation in JavaScript and TypeScript with a focus on maintainable, scalable, responsive, and user-friendly application development.",
  ],

  skills: {
    "Languages": ["HTML5", "CSS3", "TypeScript", "JavaScript", "Java"],
    "Frameworks and Libraries": ["React.js", "React Native", "Next.js", "Expo"],
    "State Management": ["Redux Toolkit", "Zustand"],
    "API & Data Management": ["React Query", "REST API", "Axios"],
    "Form & Validations": ["React Hook Form", "Yup", "Zod"],
    "UI & Styling": ["Tailwind CSS", "Material UI (MUI)", "Shadcn/ui"],
    "Build and Version Control": ["Git", "GitHub", "GitLab"],
    "Design Tools": ["Figma", "Google Stitch"],
  },

  experience: [
    {
      company: "Tech Intellect",
      role: "Frontend Developer",
      period: "August 2025 – Present",
      points: [
        "Developed reusable and responsive UI components using React.js, Next.js, TypeScript, and Tailwind CSS for enterprise web application modules.",
        "Implemented form validation using React Hook Form and Yup, including API-integrated form submissions and error handling.",
        "Developed a cross-platform student dashboard using React Native, integrating application data to enable students to view personal details and track academic payment history in real time.",
        "Integrated REST APIs with frontend applications, handling loading states, API errors, and response data transformation for consistent UI presentation.",
      ],
    },
  ],

  projects: [
    {
      name: "AI-Powered Drone and Harvester System for Aquatic Ecosystem Restoration",
      points: [
        "Implemented machine learning algorithms for real-time detection and classification of aquatic debris and vegetation.",
        "Designed and developed an AI-driven drone and harvester system for aquatic ecosystem restoration by removing invasive aquatic plants and pollutants.",
      ],
    },
    {
      name: "Food Management Services",
      points: [
        "Designed and developed a responsive web application for the college food court, streamlining food ordering and order management workflows to improve operational efficiency.",
        "Developed a web-based system to manage food inventory, meal requests, and distribution with real-time tracking and automated reporting to improve operational transparency and reduce manual errors.",
      ],
    },
  ],

  education: [
    {
      institution: "Knowledge Institute of Technology",
      location: "Salem, Tamil Nadu",
      degree: "Bachelor of Engineering in Computer Science and Engineering",
      period: "November 2021 – May 2025",
      cgpa: "7.43/10",
    },
  ],

  certificates: [
    "E-BOX: Java Programming – OOP and SQL Demystified",
    "Udemy: Web Development",
    "Internshala: Front End Development",
  ],
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

// Generic browser download helper
const triggerDownload = (content, fileName, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Convert resume object to plain text
export const resumeToText = (data = resumeData) => {
  const line = "-".repeat(60);
  const out = [];

  out.push(data.name.toUpperCase());
  out.push(data.title.toUpperCase());
  out.push(`${data.contact.phone} | ${data.contact.email}`);

  out.push("", "PROFESSIONAL SUMMARY", line);
  out.push(data.summary.join(" "));

  out.push("", "TECHNICAL SKILLS", line);
  Object.entries(data.skills).forEach(([group, items]) =>
    out.push(`${group}: ${items.join(", ")}`)
  );

  out.push("", "EXPERIENCE", line);
  data.experience.forEach((e) => {
    out.push(`${e.company} (${e.period})`, e.role);
    e.points.forEach((p) => out.push(`• ${p}`));
  });

  out.push("", "PROJECTS", line);
  data.projects.forEach((p) => {
    out.push(p.name);
    p.points.forEach((pt) => out.push(`• ${pt}`));
    out.push("");
  });

  out.push("EDUCATION", line);
  data.education.forEach((ed) => {
    out.push(`${ed.institution}, ${ed.location}`);
    out.push(`${ed.degree} (${ed.period})`);
    out.push(`• CGPA: ${ed.cgpa}`);
  });

  out.push("", "CERTIFICATES", line);
  data.certificates.forEach((c) => out.push(`• ${c}`));

  return out.join("\n");
};

// Download as .txt
export const downloadResumeAsText = () =>
  triggerDownload(resumeToText(), "Shibie_RM_Resume.txt", "text/plain");

// Download as .json
export const downloadResumeAsJSON = () =>
  triggerDownload(
    JSON.stringify(resumeData, null, 2),
    "Shibie_RM_Resume.json",
    "application/json"
  );

export const downloadResumePDF = () => {
  const PAGE = { format: 'a4', unit: 'pt' };
  const margin = 43;
  const BLACK = [0, 0, 0];
  const GRAY = [140, 140, 140];

  // Draws the resume at a given scale and returns the final Y position
  const render = (pdf, scale) => {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const left = margin;
    const right = pageWidth - margin;
    let y = 54; // baseline of the name

    const setStyle = (size, style = 'normal', color = BLACK) => {
      pdf.setFont('helvetica', style);
      pdf.setFontSize(size * scale);
      pdf.setTextColor(...color);
    };

    // Wrapped text (optionally bulleted). Advances y.
    const writeWrapped = (text, x, opts = {}) => {
      const { size = 10, style = 'normal', gap = 0, bullet = false } = opts;
      setStyle(size, style);
      const lines = pdf.splitTextToSize(String(text), right - x - 2);
      lines.forEach((line, i) => {
        if (bullet && i === 0) {
          pdf.setFillColor(...BLACK);
          pdf.circle(x - 7, y - 3.4 * scale, 1.5 * scale, 'F');
        }
        pdf.text(line, x, y);
        y += size * 1.2 * scale;
      });
      y += gap * scale;
    };

    // Left text + right-aligned text on the same line
    const writeRow = (leftText, rightText, o = {}) => {
      const {
        size = 10.9,
        leftStyle = 'bold',
        rightStyle = 'normal',
        after = 14,
      } = o;
      setStyle(size, leftStyle);
      pdf.text(leftText, left + 11, y);
      setStyle(size, rightStyle);
      pdf.text(rightText, right - 4, y, { align: 'right' });
      y += after * scale;
    };

    // Small-caps section heading with a black rule underneath
    const addSection = (title) => {
      y += 9.5 * scale;
      let cx = left;
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...BLACK);
      title
        .toUpperCase()
        .split(' ')
        .forEach((word, i) => {
          pdf.setFontSize(12 * scale);
          if (i > 0) cx += pdf.getTextWidth(' ');
          pdf.text(word[0], cx, y);
          cx += pdf.getTextWidth(word[0]);
          const rest = word.slice(1);
          pdf.setFontSize(9.6 * scale);
          pdf.text(rest, cx, y);
          cx += pdf.getTextWidth(rest);
        });
      const ruleY = y + 4 * scale;
      pdf.setDrawColor(...BLACK);
      pdf.setLineWidth(0.4);
      pdf.line(left, ruleY, right, ruleY);
      y = ruleY + 14 * scale;
    };

    // ---------- Header (centered) ----------
    const centerX = pageWidth / 2;
    setStyle(24.8, 'normal');
    pdf.text(resumeData.name.toUpperCase(), centerX, y, { align: 'center' });
    y += 14 * scale;

    setStyle(10, 'bold');
    pdf.text(resumeData.title.toUpperCase(), centerX, y, { align: 'center' });
    y += 13.5 * scale;

    // Contact line with a light-gray "|" separator
    setStyle(10, 'normal');
    const phoneW = pdf.getTextWidth(resumeData.contact.phone);
    const emailW = pdf.getTextWidth(resumeData.contact.email);
    const sepW = pdf.getTextWidth('|');
    const gapW = 6 * scale;
    let cx = centerX - (phoneW + emailW + sepW + gapW * 2) / 2;
    pdf.text(resumeData.contact.phone, cx, y);
    cx += phoneW + gapW;
    pdf.setTextColor(...GRAY);
    pdf.text('|', cx, y);
    cx += sepW + gapW;
    pdf.setTextColor(...BLACK);
    pdf.text(resumeData.contact.email, cx, y);
    y += 12 * scale;

    // ---------- Professional Summary (single paragraph) ----------
    addSection('Professional Summary');
    writeWrapped(resumeData.summary.join(' '), left + 4.5);

    // ---------- Technical Skills ----------
    addSection('Technical Skills');
    Object.entries(resumeData.skills).forEach(([group, items]) => {
      setStyle(10, 'bold');
      const label = `${group}: `;
      pdf.text(label, left + 11, y);
      const labelW = pdf.getTextWidth(label);
      setStyle(10, 'normal');
      pdf.text(items.join(', '), left + 11 + labelW, y);
      y += 13.7 * scale;
    });

    // ---------- Experience ----------
    addSection('Experience');
    resumeData.experience.forEach((item) => {
      writeRow(item.company, item.period, { size: 10.9, after: 14 });
      setStyle(10, 'italic');
      pdf.text(item.role, left + 11, y);
      y += 13 * scale;
      item.points.forEach((point) =>
        writeWrapped(point, left + 25.7, { bullet: true, gap: 1.3 })
      );
    });

    // ---------- Projects ----------
    addSection('Projects');
    resumeData.projects.forEach((item) => {
      writeWrapped(item.name, left + 11, { style: 'bold', gap: 1 });
      item.points.forEach((point) =>
        writeWrapped(point, left + 25.7, { bullet: true, gap: 1.3 })
      );
      y += 1.4 * scale;
    });

    // ---------- Education ----------
    addSection('Education');
    resumeData.education.forEach((item) => {
      writeRow(item.institution, item.location, { size: 10.9, after: 14 });
      writeRow(item.degree, item.period, {
        size: 10,
        leftStyle: 'italic',
        rightStyle: 'italic',
        after: 13,
      });
      writeWrapped(`CGPA: ${item.cgpa}`, left + 25.7, { bullet: true });
    });

    // ---------- Certificates ----------
    addSection('Certificates');
    resumeData.certificates.forEach((item) =>
      writeWrapped(item, left + 14.6, { bullet: true, gap: 1.7 })
    );

    return y;
  };

  // Shrink step by step until everything fits on one page
  const pageHeight = new jsPDF(PAGE).internal.pageSize.getHeight();
  let scale = 1;
  while (scale > 0.7 && render(new jsPDF(PAGE), scale) > pageHeight - margin) {
    scale = +(scale - 0.02).toFixed(2);
  }

  // Final render
  const pdf = new jsPDF(PAGE);
  pdf.setProperties({
    title: `${resumeData.name} - Frontend Developer Resume`,
    author: resumeData.name,
    subject: resumeData.title,
  });
  render(pdf, scale);
  pdf.save('Shibie_RM_Resume.pdf');
};