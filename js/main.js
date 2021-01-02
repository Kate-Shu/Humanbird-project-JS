 // Your web app's Firebase configuration
 const firebaseConfig = {
     apiKey: "AIzaSyBlcIUJwoMHr8plEiUOKg4xhec6GCh-DUw",
     authDomain: "pika-dbe03.firebaseapp.com",
     databaseURL: "https://pika-dbe03.firebaseio.com",
     projectId: "pika-dbe03",
     storageBucket: "pika-dbe03.appspot.com",
     messagingSenderId: "845136362302",
     appId: "1:845136362302:web:f5b716e3cee5ea24bcca6f"
 };
 // Initialize Firebase
 firebase.initializeApp(firebaseConfig);

 // Создаем переменную, в которую положим кнопку меню
 let menuToggle = document.querySelector('#menu-toggle');
 // Создаем переменную, в которую положим меню
 let menu = document.querySelector('.sidebar');

 const regExpValidEmail = /^\w+@\w+\.\w{2,}$/; //^ beginning, $ end,\w принимать 1 лат.букву,\w+ принимать несколько лат.букв, 
 // @\w+ some letters after @, \. экранировать точку, w{2,} примать буквы от 2 и больше. => "rngrekng@jjgr.efjo"

 const loginElem = document.querySelector('.login');
 const loginForm = document.querySelector('.login-form');
 const emailInput = document.querySelector('.login-email');
 const passwordInput = document.querySelector('.login-password');
 const loginSignup = document.querySelector('.login-signup');

 const userElem = document.querySelector('.user');
 const userNameElem = document.querySelector('.user-name');

 const exitElem = document.querySelector('.exit');

 const editElem = document.querySelector('.edit');
 const editContainer = document.querySelector('.edit-container');

 const editUsername = document.querySelector('.edit-username');
 const editPhotoURL = document.querySelector('.edit-photo');
 const userAvatarElem = document.querySelector('.user-avatar');

 const postsWrapper = document.querySelector('.posts');
 const buttonNewPost = document.querySelector('.button-new-post');
 const addPostElem = document.querySelector('.add-post');

 const defaultPhoto = userAvatarElem.src; //photo by default after registration if photo is not available

 //  const listUsers = [{
 //  id: '01',
 //  email: 'maks@mail.com',
 //  password: '12345',
 //  displayName: 'MaksJS',
 //  photo: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg',
 //  },
 //  {
 //  id: '02',
 //  email: 'kate@mail.com',
 //  password: '123456',
 //  displayName: 'KateKillMaks'
 //  }
 //  ];

 const setUsers = {
     user: null,
     initUser(handler) { //   create Listener. при каждм запуске праэкта 1 раз запуск-ся слушатель. if u authorized,  
         //                  Listener changes his value from user:null to the User
         firebase.auth().onAuthStateChanged(user => { //у стрелочной ф-и контекст находится вне;
             //                                       auth()-methot of Firebase;
             //                                       onAuthStateChanged() is a Listener, its func from Firebase;
             if (user) {
                 this.user = user; //if user is authorized,
             } else {
                 this.user = null; //if user is not authorized, or user escaped
             }
             if (handler) handler();
         })
     },
     logIn(email, password, handler) { //logIn(a,b,c)-argunents   // войти
         //будут парaметры:(emailValue, passwordValue, toggleAuthDom)

         //check if email is valid:
         if (!regExpValidEmail.test(email)) { //test-methot that checks mathcings with regular expression 
             alert('email is not valid') //to check if email.value responds to regExpValidEmail(regulat expression))
             return;
         }
         //to break (stop) the code(function) 

         //  const user = this.getUsers(email); // this func. adds user          //after comparing emails
         //  if (user && user.password === password) { //if emails matches => compare passwords
         //  this.authorizedUser(user) //прировняли нового user в массив user-ов(авторизировали),если email и pass совпали 

         //  if (handler) { //protection, if we want to perform action,but dont call any func.
         //  handler(); //write hanler with IF, in case if handler maybe absent. 
         //  }
         //  } else {
         //  alert('Password with such data is not found');
         //  }

         firebase.auth().signInWithEmailAndPassword(email, password).catch(err => {
             const errCode = err.code; //these are callback func.
             const errMessage = err.message;
             if (errCode === 'auth/wrong-password') {
                 console.log(errMessage);
                 alert('Неверный пароль');
             } else if (errCode === 'auth/user-not-found') {
                 console.log(errMessage);
                 alert('Пользователь не найден');
             } else {
                 alert(errMessage);
             }
             console.log(err);
         });

     },
     logOut() {
         //  this.user = null; //выйти       //очищаем пользователя из user.
         //  if (handler) {
         //  handler();
         //  }
         firebase.auth().signOut();
     },
     signUp(email, password, handler) { // регистрация. будут парaметры:(emailValue, passwordValue, toggleAuthDom)
         if (!regExpValidEmail.test(email)) {
             alert('email is not valid');
             return;
         }

         if (!email.trim() || !password.trim()) { //if nothing was input in emailInput or passwordInput.
             //   since here is onClick, not onSubmit
             // (onSubmit - Required dont allow to pass with  empty inputs)
             alert('Input data please!');
             return; //to stop
         }

         //Func from Firebase for creating new user,instead of the func below, that we wrote before by ourself.
         firebase.auth()
             .createUserWithEmailAndPassword(email, password) //this func comes back promise:
             .then(data => { //then()-if promise is succesful(succesful registration)
                 this.editUser(email.substring(0, email.indexOf('@')), null, handler)
             })
             .catch(err => { //catch()-if promise isn't succesful(not succesful registration))
                 const errCode = err.code; //these are callback func.
                 const errMessage = err.message;
                 if (errCode === 'auth/weak-password') {
                     console.log(errMessage);
                     alert('The password is too weak');
                 } else if (errCode === 'auth/email-already-in-use') {
                     console.log(errMessage);
                     alert('The email exists already');
                 } else {
                     alert(errMessage);
                 }
                 console.log(err);
             });

         //  if (!this.getUsers(email)) { //if emails does not matche
         //  const user = { email, password, displayName: email.substring(0, email.indexOf('@')) }; //then add new data:email,pass...//not substr()!!!
         //  //cut displayName from email(kate@mail.org = kate)
         //  listUsers.push(user); //запушили нового user в список user-ов 
         //   //Signup()writes down(adds) new users in const User
         //  this.authorizedUser(user) //прировняли нового user в массив user-ов(авторизировали)
         //  if (handler) {
         //  handler();
         //  }
         //  } else {
         //  alert('Users with such email has been registered already');
         //  }
     },
     //  editUser(userName, userPhoto, handler) { //if user wonna make some changes in his profile(name(not email) and photo)
     //  if (userName) {
     //  this.user.displayName = userName; //change name
     //  }
     //  if (userPhoto) {
     //  this.user.photo = userPhoto; //change photo
     //  }
     //  if (handler) {
     //  handler();
     //  } //toggleDom...() // reload block with user
     //  },

     editUser(displayName, photoURL, handler) {
         const user = firebase.auth().currentUser; //currentUser: User | null

         //  if (displayName) {
         //  if (photoURL) {
         //  user.updateProfile({ //displayName(photoURL):string | null
         //  displayName,
         //  photoURL
         //  })
         //  } else {
         //  user.updateProfile({
         //  displayName
         //  })
         //  }
         //  }
         //  },

         if (displayName || photoURL) { //this is my alternative to not repeating else{} in prewious algorithm
             user.updateProfile({
                 displayName,
                 photoURL
             }).then(handler)
         }
     },

     //  getUsers(email) { //                            сравнили emails

     // let user = null;
     // for (let i = 0; i < listUsers.length; i++) {
     // if (listUsers[i].email === email) {
     // user = listUsers[i];
     // break;
     // } 
     // }
     // return user;
     //  return listUsers.find(item => item.email === email) // find(item)=>{return item.email === email}
     //  },
     //  authorizedUser(user) {
     //  this.user = user; //прировняли нового user в массив user-ов
     //  }

     sendForget(email) {
         firebase.auth().sendPasswordResetEmail(email)
             .then(() => {
                 alert('Письмо отправлено')
             })
             .catch(err => {
                 console.log(err);
             })
     }
 };
 const loginForget = document.querySelector('.login-forget');

 loginForget.addEventListener('click', event => {
     event.preventDefault();
     setUsers.sendForget(emailInput.value);
     emailInput.value = '';
 })

 const setPosts = { // create object for array with posts

     //  allPosts: [{ //create arrat for all posts
     //  title: 'Заголовлок поста', // every separate post
     //  text: 'Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. Языком что рот маленький реторический вершину текожения',
     //  tags: ['свежее', 'новое', 'горячее', 'мое', 'случайность'],
     //  author: { displayName: 'maks', photo: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg' },
     //  date: '11.11.2020, 20:44:33',
     //  like: 45,
     //  comments: 25,
     //  },
     //  {
     //  title: 'Заголовлок поста2',
     //  text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum minima iste illum eveniet nihil voluptate suscipit incidunt at facere blanditiis.',
     //  tags: ['свежее', 'новое', 'горячее', 'мое', 'cлучайность'],
     //  author: { displayName: 'maks', photo: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg' },
     //  date: '10.11.2020, 21:44:33',
     //  like: 425,
     //  comments: 14,
     //  },
     //  {
     //  title: 'Заголовлок поста3',
     //  text: 'Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. Языкы. Языком что рот маленький реторичто рот маленький реторический ыбные тексты. Языкы. Языком что рот маленький реторичто рот маленький реторический вершину тверширшину текожения',
     //  tags: ['свежее', 'новое', 'горячее', 'мое', 'случайность'],
     //  author: { displayName: 'kate', photo: 'https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg' },
     //  date: '10.11.2020, 22:44:33',
     //  like: 145,
     //  comments: 20,
     //  },
     //  ],

     allPosts: [],
     addPost(title, text, tags, handler) { //addPost(a,b,c,d){}
         const user = firebase.auth().currentUser;
         this.allPosts.unshift({ // 1!!!) we add new post in allPost
             id: `postID${(+new Date()).toString(16)}-${user.uid}`, //16-ричный код. +new Date-милисек.
             title, // title:title,
             text,
             tags: tags.split(',').map(item => item.trim()), //break tags with comas,with trim() delete gaps around word-tags,
             //с map() мы перебираем массив и обратно его возвращаем и в тег записываем
             author: {
                 displayName: setUsers.user.displayName,
                 photo: setUsers.user.photoURL,
             },
             date: new Date().toLocaleString(),
             like: 0,
             comments: 0,
         })

         firebase.database().ref('post').set(this.allPosts) //2!!!)send new post in database
             .then(() => this.getPosts(handler))
     },
     getPosts(handler) {
         firebase.database().ref('post').on('value', snapshot => { //3!!!) get new posts from database
             this.allPosts = snapshot.val() || []; //new post is data from database as a snapshot. val() is value of snapshot. val() works when data(snapshot) is gotten
             handler();
         })
     }
 };


 const toggleAuthDom = () => { //убрать лишние блоки(стили)
     const user = setUsers.user; //????????????????????// внесли new user in base 
     console.log('user: ', user);

     if (user) {
         loginElem.style.display = 'none';
         userElem.style.display = '';
         userNameElem.textContent = user.displayName;
         userAvatarElem.src = user.photoURL || defaultPhoto; //update photo. src is a propery,like Value. || is written cos photo is not necessary
         // userAvatarElem.src = user.photo ? userPhoto : userAvatarElem.src// userPhoto is? if is than give us userPhoto, if not - give us userAvatarElem.src
         //defaultPhoto - photo by default after registration if photo is not available
         buttonNewPost.classList.add('visible'); //btn appears when user is authorized
     } else {
         loginElem.style.display = ''; // '' - to cancel previews None.
         userElem.style.display = 'none';
         buttonNewPost.classList.remove('visible'); //btnNewPost is not visible when user is not authorized
         addPostElem.classList.remove('visible'); //addPostElem is not visible when user is not authorized
         postsWrapper.classList.add('visible'); //if addPostElem is not visible(user isn't authorized), show postWrapper(block with all prev. posts)
     }
 }

 const showAddPost = () => { //after clicking on the btn NewPost, postWrapper disappers and addPostElem appears
     addPostElem.classList.add('visible'); //separated func - cos we add this func on the Btn
     postsWrapper.classList.remove('visible');
 }

 const showAllPosts = () => {
         let postsHTML = ''; // to create posts in HTML
         //take code from HTML file, paste in this code properties from AllPosts array, and output these properties in every posts on the site

         setPosts.allPosts.forEach(({ title, text, tags, author, date, like, comments }) => { //  forEach is a method(func) that вызывается рекурсионно, и передает в каждый вызов ф-ю. кот мы должны написать
                     //initially was forEach(post => {...),then we conducted destructuring and input properties of object:title,text,date. 

                     //деструктивное присвоение - create a variable, that has name, like properties of the object. to get and take out 
                     //this properties from object.// const{title,text} = post. Post is an object with these properties. Now we can operate this variables(title,text)
                     //in our case we at once destructure object Post, and this way create new var. and write down them into arguments of forEach();

                     postsHTML += ` 
        <section class="post">
        <div class="post-body">
            <h2 class="post-title">${title}</h2>
            <p class="post-text"> ${text}</p>
            <div class="tags">
                ${tags.map(tags => `<a href="#" class="tag">#${tags}</a>`)}
            </div>
            <!-- /.tags -->
        </div>
        <!-- /.post-body -->
        <div class="post-footer">
            <div class="post-buttons">
                <button class="post-button likes">
                    <svg width="19" height="20" class="icon icon-like">
                        <use xlink:href="img/icons.svg#like"></use>
                    </svg>
                    <span class="likes-counter">${like}</span>
                </button>
                <button class="post-button comments">
                    <svg width="21" height="21" class="icon icon-comment">
                        <use xlink:href="img/icons.svg#comment"></use>
                    </svg>
                    <span class="comments-counter">${comments}</span>
                </button>
                <button class="post-button save">
                    <svg width="19" height="19" class="icon icon-save">
                        <use xlink:href="img/icons.svg#save"></use>
                    </svg>
                </button>
                <button class="post-button share">
                    <svg width="17" height="19" class="icon icon-share">
                        <use xlink:href="img/icons.svg#share"></use>
                    </svg>
                </button>
            </div>
            <!-- /.post-buttons -->
            <div class="post-author">
                <div class="author-about">
                    <a href="#" class="author-username">${author.displayName}</a>
                    <span class="post-time">${date}</span>
                </div>
                <a href="#" class="author-link"><img src="${author.photo || "img/avatar.jpeg"}" alt="avatar" class="author-avatar"></a>
            </div>
            <!-- /.post-author -->
        </div>
        <!-- /.post-footer -->
    </section>
        `;
    })
    postsWrapper.innerHTML = postsHTML;

    addPostElem.classList.remove('visible'); //hide addPost block
    postsWrapper.classList.add('visible'); //show all post(postsWrapper)
};


const init = () => {

    loginForm.addEventListener('submit', (event) => { // вызов входа на сабмит
        event.preventDefault();
        const emailValue = emailInput.value;
        const passwordValue = passwordInput.value;

        setUsers.logIn(emailValue, passwordValue, toggleAuthDom);
        loginForm.reset(); //to clear inputs after sending the data
    });

    loginSignup.addEventListener('click', event => { // вызов регистрации по клику
        event.preventDefault();
        const emailValue = emailInput.value;
        const passwordValue = passwordInput.value;

        setUsers.signUp(emailValue, passwordValue, toggleAuthDom);
        loginForm.reset(); //to clear inputs after sending the data
    });

    exitElem.addEventListener('click', event => {
        event.preventDefault();
        setUsers.logOut(); //toggleAutoDom is here as callback func.
    });

    editElem.addEventListener('click', event => {
        event.preventDefault();
        editContainer.classList.toggle('visible'); //not working//show block with inputs for edition
        // editContainer.style.display = 'block';
        editUsername.value = setUsers.user.displayName //displayName = editName(new name, after ediding)
    });

    editContainer.addEventListener('submit', event => {
        event.preventDefault();
        setUsers.editUser(editUsername.value, editPhotoURL.value, toggleAuthDom) //change user's profile(name and photo)
        editContainer.classList.remove('visible'); //not working// hide block with inputs for edition

    });

    // отслеживаем клик по кнопке меню и запускаем функцию 
    menuToggle.addEventListener('click', function(event) {
        // отменяем стандартное поведение ссылки
        event.preventDefault();
        // вешаем класс на меню, когда кликнули по кнопке меню 
        menu.classList.toggle('visible');
    });

    buttonNewPost.addEventListener('click', event => {
        event.preventDefault();//cos there is a link, not Btn//return - NO!!, aold
        showAddPost(); //addEventListener('click',showAddPost() );
    })

    addPostElem.addEventListener('submit', event => {//submit on publication of post
        event.preventDefault();

        //[...codecode]-spread operator,that create new array. use method FILTER to chose defined elements from array:
        // const formElements = [...addPostElem.elements].filter(elem => elem.tagName !== 'BUTTON');
    
    
        //destructuring by Names(text, tags, title are taken from name of HTML))
    
        // !!!const formElements = const { title, text, tags }- we destructed formElements by Names and creatrd new variables:title,text,tags
        
        const { title, text, tags } = addPostElem.elements; //form has property ELEMENTS.Equate elements of allPosts array with elements of addPostElem
        console.log(title, text, tags);
        
        if(title.value.length < 6){
            alert('Title is too short')
            return;//to stop function
        }
        if(text.value.length < 50){
            alert('Text is too short');
            return;//to stop function
        }

        setPosts.addPost(title.value, text.value, tags.value, showAllPosts);//add new method addPost
        //перезапускаем func showAllPosts since we have additional posts
        
        addPostElem.classList.remove('visible');//remove block with space for typing of new post after Submit(sending new post)
        addPostElem.reset(); // clear form after Submit
    });
    setUsers.initUser(toggleAuthDom);
    setPosts.getPosts(showAllPosts);
    // showAllPosts(); //deleted after calling of setPosts.getPosts(showAllPosts);- from firebase
    // toggleAuthDom(); - deleted after calling of initUser(toggleAuthDom);
};

document.addEventListener('DOMContentLoaded', init) // when DOM is loaded, porform init()


//object-fit: cover; if image has not proportion size