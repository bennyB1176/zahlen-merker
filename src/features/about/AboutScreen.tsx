export function AboutScreen() {
  return (
    <div className="screen">
      <h1>How this works</h1>
      <p className="subtitle">The science behind the trainer.</p>

      <div className="card">
        <h3>RSVP — one word at a time</h3>
        <p className="meta" style={{ marginBottom: 0 }}>
          Words flash at a single fixed point so your eyes stop jumping and re-reading
          (saccades and regressions), the biggest time cost in normal reading.
        </p>
      </div>

      <div className="card">
        <h3>ORP pivot</h3>
        <p className="meta" style={{ marginBottom: 0 }}>
          The red letter is the Optimal Recognition Point. Keeping it centred lets you
          recognise each word with a single glance.
        </p>
      </div>

      <div className="card">
        <h3>Guided highlight</h3>
        <p className="meta" style={{ marginBottom: 0 }}>
          A sweeping highlight over normal text trains the eye movements you actually use
          in books and on screens — RSVP alone transfers only partly to real reading.
        </p>
      </div>

      <div className="card">
        <h3>Number flash</h3>
        <p className="meta" style={{ marginBottom: 0 }}>
          A number flashes for a fraction of a second, then you type it. Because you
          cannot sound out seven or more digits that fast, this trains your{' '}
          <strong>perceptual span</strong> — how much you grasp in a single glance — and
          your visual working memory, while discouraging the inner voice. Its score is
          your best <strong>digit span</strong>, and it adapts to keep you at your edge.
          Transfer to reading is indirect, but it builds the same underlying muscles.
        </p>
      </div>

      <div className="card">
        <h3>Silence the inner voice</h3>
        <p className="meta" style={{ marginBottom: 0 }}>
          <strong>Subvocalization</strong> — silently saying each word — caps you near
          talking speed. You can’t delete it entirely, but the reader gives you two ways
          to quiet it: a steady <strong>beat</strong> that occupies your inner voice while
          you read, and a one-tap <strong>“Quiet speed”</strong> that jumps above ~450
          WPM, where the voice simply can’t keep up. Reading more{' '}
          <strong>words per flash</strong> helps too — you recognise a chunk as a shape
          instead of sounding it out.
        </p>
      </div>

      <div className="card">
        <h3>How much per day</h3>
        <p className="meta" style={{ marginBottom: 0 }}>
          Consistency beats marathons: about <strong>15–20 minutes a day</strong> — a
          couple of passages with the quiz plus a short number-flash set. The{' '}
          <strong>Today</strong> card on the home screen tracks it, and keep comprehension
          at 70% or higher; if it dips, slow down and let understanding lead.
        </p>
      </div>

      <div className="card">
        <h3>Comprehension leads speed</h3>
        <p className="meta" style={{ marginBottom: 0 }}>
          Your headline score is{' '}
          <strong>effective WPM = raw speed × comprehension</strong>. A quiz after each
          library passage keeps you honest, and your target speed only climbs while you
          keep understanding what you read.
        </p>
      </div>

      <div className="note">
        A note on honesty: claims of 1000+ WPM with full comprehension are not supported
        by reading research. Meaning is built by the brain, and it has a ceiling.
        Realistic, durable gains — say from 200 to 400 effective WPM — come from short,
        regular practice. That is what this app is built to grow.
      </div>

      <p className="subtitle" style={{ marginTop: 16 }}>
        Private by design: everything is stored on your device. No account, no tracking.
        Installable to your home screen and works offline.
      </p>
    </div>
  );
}
