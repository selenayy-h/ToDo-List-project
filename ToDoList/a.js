//Tüm Elementleri Seçmek

const form = document.querySelector("#todoAddForm");
const addInput = document.querySelector("#todoName");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const clearButton = document.querySelector("#clearButton");//tüm todoları temizlemek için kullanılann metod
const filterInput = document.querySelector("#todoSearch");

let todos = [];

runEvents();

function runEvents() {
    //bu eventları çalıştırıcak olan metoddur
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded",pageLoaded); //sayfa yüklendiğinde pageloaded metodunu çalıştır
    secondCardBody.addEventListener("click",removeTodoToUI);//second cardbodynin üzerine click yapıldığında removetodouı yı çağır
    clearButton.addEventListener("click",allTodosEverywhere);
    filterInput.addEventListener("keyup",filter);
}

function pageLoaded(){
    //Bunu kullanmasaydım eğer ben sayfayı yeniledikçe benim todolistte altta yazılması gerekenler yazılmayacaktı boş sayfa görünücekti
    //ama şimdi bunun sayesinde storage dan çekilen veriler buraya gelicek ve görebilicem listemdeki elemanları
    checkTodosFromStorage();
    todos.forEach(function(todo){//todosun üzerinde foreachle döneceğim ve her birini todo olarak yakalayacağım
       addTodoToUI(todo);//defalarca her biri eklenen için li,a,i iç içe metodunu yazmamak için bunu yazıyoruz
    
    });
}

function filter(e){
    //arama işlemi için kullanılan metod
    const filterValue = e.target.value.toLowerCase().trim();//b-k harf duyarlılığı,trim sağdaki soldaki boşlukları temizlemek demektir
    const todoListesi = document.querySelectorAll(".list-group-item");
    
    if(todoListesi.length>0){
        todoListesi.forEach(function(todo){
            if(todo.textContent.toLowerCase().trim().includes(filterValue)){//includes içeriyor mu diye bakmak için kullanılır

                // todo.textContent.toLowerCase()trim() =yani bu da fıstık ezmesi demek içeriyor mu ezmeyi=.includes(filterValue)
                //buradaki filter value benim girdiğim değer oluyor
                todo.setAttribute("style","display : block");//block ekranda görüntülenmesini sağlar
            }else{
                todo.setAttribute("style","display : none !important");
            }
        });

    }else{
        showAlert("warning","Filtreleme yapmak için en az bir todo olmalıdır!");
    }

}

function allTodosEverywhere(){
   const todoListesi = document.querySelectorAll(".list-group-item");//bu class ismindeki bütün li leri yakalamış oluyor
   if(todoListesi.length>0){//eğer ekranda min 1 todo varsa bu işlemi yap
    //Ekrandan Silme
    todoListesi.forEach(function(todo){//aslında burada todo olarak yazdığın her şey birer li etiketidir
        todo.remove();
    });

    //Storage'dan Silme
    todos=[];//burada diziyi başlangıç formatına alıyorum
    localStorage.setItem("todos",JSON.stringify(todos));//diziyi json formatında yazma işlemi
    showAlert("success","Başarılı bir şekilde silindi");
   }else{
    showAlert("warning","Silmek için en az bir todo olmalıdır");
   }
}


       //Ekrandan Silme
function removeTodoToUI(e){
    if(e.target.className==="fa fa-remove"){
        //buradaki koddan adamın çarpı ikonun bastıığını anlayabiliyoruz
 
       const todo = e.target.parentElement.parentElement;
       //e.target=i elementi ben bunun parentini alırasam a etiketi bir daha parent alırsam li 
       todo.remove();//ve yakaladığım li etiketini remove metoduyla kaldırdım aslında

       //Storage'dan Silme
       removeTodoToStorage(todo.textContent);
       showAlert("success","Todo başarıyla silindi.");
    }
}


function removeTodoToStorage(removeTodo){
    checkTodosFromStorage();
    todos.forEach(function(todo,index){//yakalamış olduğumuz her bir todonun birde index numarasını araya , koyarak yakalayabilrlisiniiz
        if(removeTodo===todo){//bana dışarıdan gelen remove todo ile benim storagedaki todom eşitse
            todos.splice(index,1);//diziden elemanı silmek için splice  metodunu kullanıyor
            //index:nereden başlaycağını belirtiyor yanındaki 1 ise kaç tane eleman silmesi gerektiğini belirtiyor
        }
    });
    localStorage.setItem("todos",JSON.stringify(todos));//todosun güncel halini setliyoruz burada
}



function addTodo(e) {
    const inputText = addInput.value.trim();
     //buradakş inputtext aslında yazdığımız yazı 
   //trim->trimlenmiş bir şekilde yani sağdaki soldaki tüm boşlulkları yok edilmiş şekilde
    if (inputText == null || inputText == "") {
        showAlert("warning", "Lütfen boş bırakmayınız!");
    } else {
        //Arayüze ekleme
        addTodoToUI(inputText);
        addTodoToStorage(inputText);
        showAlert("success", "Todo Eklendi.");//burada da eklenince yeşil rengi sağlamak için succes veriyotus
    }

    //storage ekleme
    e.preventDefault();
}

function addTodoToUI(newTodo) {
    /*
<li class="list-group-item d-flex justify-content-between">Todo 1
                            <a href="#" class="delete-item">
                                <i class="fa fa-remove"></i>
                            </a>
                        </li>
                        */
    const li =document.createElement("li");
                        li.className="list-group-item d-flex justify-content-between";
                        li.textContent=newTodo;//li nin textcontenti aslında bana gelen newtodo
                        const a = document.createElement("a");//burada a etiketi oluşturuyoruz
                        a.href="#";
                        a.className="delete-item";
                        
                        const i =document.createElement("i");//burada i etiketini tanımlıyoruz
                        i.className="fa fa-remove";
                        
                        a.appendChild(i);// a etiketi içine  i yi alıyor
                        li.appendChild(a);// li içine a yı alıyor
                        todoList.appendChild(li);
                        

}

function addTodoToStorage(newTodo) {
    checkTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function checkTodosFromStorage() {
    if (localStorage.getItem("todos") === null) {//local storageda todos adına sahip bir key var mı yok mu onu araştırıyor
        todos = [];//böyle bir şey olmadığı için başlangıçta boş bir dizi olarak toodosu başktaıyprum
        //eğer sen bu kontrolu yapmadan direkt üstüne yazarsan eskisini kaybedersin 
         //alıp üzerine koyup yenisini vermeniz gerekiyor
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
}

function showAlert(type, message) {
    /*
    <div class="alert alert-warning" role="alert">
    This is a warning alert—check it out!
  </div>*/
    const div = document.createElement("div");//div elementini oluştur
    //   div.className="alert alert-"+type;
    div.className = `alert alert-${type}`; //litirel template
    div.textContent = message;

    firstCardBody.appendChild(div);

    setTimeout(function(){
        div.remove();
    },2500);// yeşil veya kırmızı butonlar çıktıktan sonra 2.5 saniye içinde kaldırılmasını sağlar
}
