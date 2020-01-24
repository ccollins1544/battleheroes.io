const mongoose = require("mongoose");
const db = require("../models");

mongoose.connect(
  process.env.MONGODB_URI ||
  "mongodb://localhost/google_books"
);

const bookSeed = [
  {
    authors: ["Suzanne Collins"],
    description: "First in the ground-breaking HUNGER GAMES trilogy, this new foiled edition of THE HUNGER GAMES is available for a limited period of time. Set in a dark vision of the near future, a terrifying reality TV show is taking place. Twelve boys and twelve girls are forced to appear in a live event called The Hunger Games. There is only one rule: kill or be killed. When sixteen-year-old Katniss Everdeen steps forward to take her younger sister's place in the games, she sees it as a death sentence. But Katniss has been close to death before. For her, survival is second nature.",
    image: "http://books.google.com/books/content?id=_zSzAwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
    link: "http://books.google.com/books?id=_zSzAwAAQBAJ&dq=hunger+games&hl=&source=gbs_api",
    title: "The Hunger Games",
    date: new Date(Date.now())
  },
  {
    authors: ["Philip K. Dick"],
    description: "World War Terminus had left the Earth devastated. Through its ruins, bounty hunter Rick Deckard stalked, in search of the renegade replicants who were his prey. When he wasn't 'retiring' them with his laser weapon, he dreamed of owning a live animal - the ultimate status symbol in a world all but bereft of animal life. Then Rick got his chance: the assignment to kill six Nexus-6 targets, for a huge reward. But in Deckard's world things were never that simple, and his assignment quickly turned into a nightmare kaleidoscope of subterfuge and deceit - and the threat of death for the hunter rather than the hunted ...",
    image: "http://books.google.com/books/content?id=MoEO9onVftUC&printsec=frontcover&img=1&zoom=5&source=gbs_api",
    link: "http://books.google.com/books?id=MoEO9onVftUC&dq=bladerunner&hl=&source=gbs_api",
    title: "Do Androids Dream Of Electric Sheep?",
    date: new Date(Date.now())
  },
  {
    authors: ["Brian Herbert", "Kevin J. Anderson"],
    description: "Brian Herbert and Kevin J. Anderson's Navigators of Dune is the climactic finale of the Great Schools of Dune trilogy, set 10,000 years before Frank Herbert's classic Dune. The story line tells the origins of the Bene Gesserit Sisterhood and its breeding program, the human-computer Mentats, and the Navigators (the Spacing Guild), as well as a crucial battle for the future of the human race, in which reason faces off against fanaticism. These events have far-reaching consequences that will set the stage for Dune, millennia later. At the Publisher's request, this title is being sold without Digital Rights Management Software (DRM) applied.",
    image: "http://books.google.com/books/content?id=D12dCwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
    link: "https://play.google.com/store/books/details?id=D12dCwAAQBAJ&source=gbs_api",
    title: "Navigators of Dune",
    date: new Date(Date.now())
  },
  {
    authors: ["J.K. Rowling", "John Tiffany", "Jack Thorne"],
    description: "Based on an original new story by J.K. Rowling, Jack Thorne and John Tiffany, a new play by Jack Thorne, Harry Potter and the Cursed Child is the eighth story in the Harry Potter series and the first official Harry Potter story to be presented on stage. The play received its world premiere in London’s West End on 30th July 2016. It was always difficult being Harry Potter and it isn’t much easier now that he is an overworked employee of the Ministry of Magic, a husband and father of three school-age children. While Harry grapples with a past that refuses to stay where it belongs, his youngest son Albus must struggle with the weight of a family legacy he never wanted. As past and present fuse ominously, both father and son learn the uncomfortable truth: sometimes, darkness comes from unexpected places.",
    image: "http://books.google.com/books/content?id=tcSMCwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
    link: "http://books.google.com/books?id=tcSMCwAAQBAJ&dq=harry+potter&hl=&source=gbs_api",
    title: "Harry Potter and the Cursed Child – Parts One and Two (Special Rehearsal Edition)",
    date: new Date(Date.now())
  }
];

db.Book
  .remove({})
  .then(() => db.Book.collection.insertMany(bookSeed))
  .then(data => {
    console.log(data.result.n + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
