export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
      <h1 className="text-3xl font-bold text-white">About SafeNet</h1>

      <p className="text-muted">
        SafeNet is a digital safety platform designed to help prevent and respond
        to technology-facilitated gender-based violence. It supports safer online
        experiences through awareness, detection, and evidence documentation.
      </p>

      <div className="space-y-3 text-sm text-muted">
        <p>
          <strong>Why SafeNet Exists</strong><br />
          Online spaces are increasingly used to harass, threaten, impersonate,
          and exploit women and girls. SafeNet was created to help users recognize
          harmful digital behavior early and take informed action.
        </p>

        <p>
          <strong>What SafeNet Does</strong><br />
          SafeNet provides tools to analyze text messages, screenshots, and
          profile images for signs of harassment, threats, grooming, hate speech,
          and impersonation. Users can save alerts as evidence and access safety
          guidance and support resources.
        </p>

        <p>
          <strong>Who SafeNet Is For</strong><br />
          SafeNet is designed for individuals, students, and communities who want
          safer online interactions, especially women and girls affected by
          digital violence.
        </p>

        <p>
          <strong>Technology</strong><br />
          SafeNet is built using React, TypeScript, and a Node.js backend. The
          system uses simulated detection logic suitable for education,
          prototyping, and awareness-focused solutions.
        </p>

        <p>
          <strong>Important Note</strong><br />
          SafeNet is a support and awareness tool. It does not replace emergency
          services, legal authorities, or professional counseling.
        </p>
      </div>
    </div>
  );
}

