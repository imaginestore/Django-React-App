import React from "react";
import Sidebar from "./User/Sidebar";

function TextToSpeech() {
  const handleClick = () => {
    const text =
      "Built during a time when Egypt was one of the richest and most powerful civilizations in the \
      world, the pyramids—especially the Great Pyramids of Giza—are some of the most magnificent \
      man-made structures in history. Their massive scale reflects the unique role that the pharaoh, \
      or king, played in ancient Egyptian society. Though pyramids were built from the beginning of \
      the Old Kingdom to the close of the Ptolemaic period in the fourth century A.D., the peak of \
      pyramid building began with the late third dynasty and continued until roughly the sixth \
      (c. 2325 B.C.). More than 4,000 years later, the Egyptian pyramids still retain much of \
      their majesty, providing a glimpse into the country’s rich and glorious past. \
      The Pharaoh in Egyptian Society. \
      During the third and fourth dynasties of the Old Kingdom, Egypt enjoyed \
      tremendous economic prosperity and stability. Kings held a unique position in Egyptian society. \
      Somewhere in between human and divine, they were believed to have been chosen by the gods \
      themselves to serve as their mediators on earth. Because of this, it was in everyone’s \
      interest to keep the king’s majesty intact even after his death, when he was believed to \
      become Osiris, god of the dead. The new pharaoh, in turn, became Horus, the falcon-god who \
      served as protector of the sun god, Ra. \
      Did you know? The pyramid's smooth, angled sides symbolized the rays of the sun and were designed \
      to help the king's soul ascend to heaven and join the gods, particularly the sun god Ra. \
      Ancient Egyptians believed that when the king died, part of his spirit (known as “ka”) \
      remained with his body. To properly care for his spirit, the corpse was mummified, and \
      everything the king would need in the afterlife was buried with him, including gold vessels, \
      food, furniture and other offerings. The pyramids became the focus of a cult of the dead king \
      that was supposed to continue well after his death. Their riches would provide not only for him, \
      but also for the relatives, officials and priests who were buried near him.";

    const value = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(value);
  };

  const iconStyle = {
    "font-size": "25px",
  };

  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <aside className="col-md-3">
          <Sidebar />
        </aside>
        <section className="col-md-9">
          <div className="card">
            <h5 className="card-header">Text to Speech in React Application</h5>
            <div className="card-body">
              <p id="contentext">
                Built during a time when Egypt was one of the richest and most
                powerful civilizations in the world, the pyramids—especially the
                Great Pyramids of Giza—are some of the most magnificent man-made
                structures in history. Their massive scale reflects the unique
                role that the pharaoh, or king, played in ancient Egyptian
                society. Though pyramids were built from the beginning of the
                Old Kingdom to the close of the Ptolemaic period in the fourth
                century A.D., the peak of pyramid building began with the late
                third dynasty and continued until roughly the sixth (c. 2325
                B.C.). More than 4,000 years later, the Egyptian pyramids still
                retain much of their majesty, providing a glimpse into the
                country’s rich and glorious past.
              </p>
              <p>
                The Pharaoh in Egyptian Society. During the third and fourth
                dynasties of the Old Kingdom, Egypt enjoyed tremendous economic
                prosperity and stability. Kings held a unique position in
                Egyptian society. Somewhere in between human and divine, they
                were believed to have been chosen by the gods themselves to
                serve as their mediators on earth. Because of this, it was in
                everyone’s interest to keep the king’s majesty intact even after
                his death, when he was believed to become Osiris, god of the
                dead. The new pharaoh, in turn, became Horus, the falcon-god who
                served as protector of the sun god, Ra.
              </p>
              <p>
                Did you know? The pyramid's smooth, angled sides symbolized the
                rays of the sun and were designed to help the king's soul ascend
                to heaven and join the gods, particularly the sun god Ra.
              </p>
              <p>
                Ancient Egyptians believed that when the king died, part of his
                spirit (known as “ka”) remained with his body. To properly care
                for his spirit, the corpse was mummified, and everything the
                king would need in the afterlife was buried with him, including
                gold vessels, food, furniture and other offerings. The pyramids
                became the focus of a cult of the dead king that was supposed to
                continue well after his death. Their riches would provide not
                only for him, but also for the relatives, officials and priests
                who were buried near him.
              </p>
              <i
                onClick={handleClick}
                className="bi bi-volume-up-fill text-secondary btn"
                style={iconStyle}
              ></i>
              {/* <i
                onClick={handleClick}
                className="bi bi-megaphone text-secondary btn"
                style={iconStyle}
              ></i> */}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TextToSpeech;
