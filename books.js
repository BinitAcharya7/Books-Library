let books; /*a global books var so we know if we already have books so we don't need to keep awaiting inside the render function*/

async function renderBooks(filter) {
  const booksWrapper = document.querySelector('.books');

  booksWrapper.classList +=
    ' books__loading'; /* we work around await so we put a loading rotator before it loads*/

  if (!books) {
    books = await getBooks();
  } /* if the books already exist (the global var books already exists) then we don't await and simply use the books array we already have got from getBooks()*/
  booksWrapper.classList.remove(
    'books__loading'
  ); /*then right after it loads we remove the rotator class which effectively make it display: none*/

  // Create a copy to avoid mutating the original data. and displayBooks can be mutated all we want for display purposes and it will reset back again to books. Its exactly the problem in convolutions (using that Sobel operator)

  let displayBooks = books.map((book) => ({
    ...book,
  })); /* for each book it copies all object properties into a new object for that book */

  if (filter === 'LOW_TO_HIGH') {
    displayBooks.sort(
      (a, b) =>
        (a.salePrice || a.originalPrice) - (b.salePrice || b.originalPrice)
    );
  } else if (filter === 'HIGH_TO_LOW') {
    displayBooks.sort(
      (a, b) =>
        (b.salePrice || b.originalPrice) - (a.salePrice || a.originalPrice)
    );
  } else if (filter === 'RATING') {
    displayBooks.sort((a, b) => b.rating - a.rating);
  }

  /* use displayBooks like everywhere else but especially here */
  for (let book of displayBooks) {
    // let stars = ''
    if (!Number.isInteger(book.rating)) {
      book.rating =
        `<i class="fas fa-star"></i>`.repeat(Math.floor(book.rating)) +
        `<i class="fas fa-star-half-alt"></i>`;
    } else {
      book.rating = `<i class="fas fa-star"></i>`.repeat(book.rating);
    }
  } /* overwriting every rating to just the icons since we don't need to use them anywhere else. we sort the books by their rating (the actual numbers) BEFOREHAND so when we click sort by rating, renderBooks gets called and it will first sort then turn each rating into star icons. 
  
  HUGE CORRECTION: this approach came back to bite us since now we're just trying to use the original numerical rating we get from getBooks() since it takes time and we don't want to call it every time we click on a sorting value (by rating, by price) ### so we're stuck with always having to wait for that function's value since that's the only thing that has the original numbers for us and not icons. so thats why we made displayBooks which takes all our books EVERY SINGLE TIME we call render, and we just work with it and modify it all we want. It will happily reset after the render is called again : -`) */

  booksWrapper.innerHTML = ''; // Clear previous content before rendering
  displayBooks.map((book) => {
    booksWrapper.innerHTML += `<div class="book">
            <figure class="book__img--wrapper">
              <img class="book__img" src="${book.url}" alt="">
            </figure> 
            <div class="book__title">
              ${book.title}
            </div>
            <div class="book__ratings">
             ${book.rating} 
            </div>
            <div class="book__price">
             ${displaySales(book.originalPrice, book.salePrice)}
            </div>
          </div>`;
  });
} /*if we took the other approach to stringify the whole array and get the new array and finally join it to get rid of the commas, and then changed the innerHTML we would need to call a function to display ratings which turns each rating into a star as the map method loops over each book and calls it on it's rating*/

/*couldn't not use a function to display prices */

renderBooks();

function filterBooks(event) {
  renderBooks(event.target.value);
}

function displaySales(originalPrice, salePrice) {
  if (salePrice == null) {
    return `NPR ${originalPrice}`;
  }
  return `<span class="book__price--normal">${originalPrice}</span> ${salePrice}`;
}

// FAKE DATA
function getBooks() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          title: 'Crack the Coding Interview',
          url: 'assets/crack the coding interview.png',
          originalPrice: 890,
          salePrice: 745,
          rating: 4.5,
        },
        {
          id: 2,
          title: 'Atomic Habits',
          url: 'assets/atomic habits.jpg',
          originalPrice: 2055,
          salePrice: null,
          rating: 5,
        },
        {
          id: 3,
          title: 'Deep Work',
          url: 'assets/deep work.jpeg',
          originalPrice: 1400,
          salePrice: 675,
          rating: 5,
        },
        {
          id: 4,
          title: 'The 10X Rule',
          url: 'assets/book-1.jpeg',
          originalPrice: 1500,
          salePrice: 755,
          rating: 4.5,
        },
        {
          id: 5,
          title: 'Be Obsessed Or Be Average',
          url: 'assets/book-2.jpeg',
          originalPrice: 1750,
          salePrice: 895,
          rating: 4,
        },
        {
          id: 6,
          title: 'Rich Dad Poor Dad',
          url: 'assets/book-3.jpeg',
          originalPrice: 2600,
          salePrice: 1050,
          rating: 5,
        },
        {
          id: 7,
          title: 'Cashflow Quadrant',
          url: 'assets/book-4.jpeg',
          originalPrice: 1785,
          salePrice: 987,
          rating: 4,
        },
        {
          id: 8,
          title: '48 Laws of Power',
          url: 'assets/book-5.jpeg',
          originalPrice: 2090,
          salePrice: 863,
          rating: 4.5,
        },
        {
          id: 9,
          title: 'The 5 Second Rule',
          url: 'assets/book-6.jpeg',
          originalPrice: 1785,
          salePrice: null,
          rating: 4,
        },
        {
          id: 10,
          title: 'Your Next Five Moves',
          url: 'assets/book-7.jpg',
          originalPrice: 855,
          salePrice: null,
          rating: 4,
        },
        {
          id: 11,
          title: 'Mastery',
          url: 'assets/book-8.jpeg',
          originalPrice: 965,
          salePrice: null,
          rating: 4.5,
        },
      ]);
    }, 1000);
  });
}
