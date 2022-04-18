console.log("In public section ");

console.log("Running");
// document.querySelector('.cross').style.display = 'none';
// document.querySelector('.hamburger').addEventListener("click", ()=>{
  
//     document.querySelector('.main-sidebar').classList.toggle('sidebarGo');
   
//     if( document.querySelector('.main-sidebar').classList.contains('sidebarGo')){
//         document.querySelector('.ham').style.display = 'inline';
//         document.querySelector('.cross').style.display = 'none';

//     }else{
//         document.querySelector('.ham').style.display = 'none';
//         document.querySelector('.cross').style.display = 'inline';
//     }
// }) 
function func(){
    var checkboxes = document.querySelectorAll("input[type ='checkbox']");
    // function checkAll(myChechbox){
            // if(myChechbox.checked == true){
        console.log("hello");
}
var hidden = false;
function action() {
    hidden = !hidden;
    if(hidden) {
        document.getElementById('memDeleteSelected').style.visibility = 'hidden';
    } else {
        document.getElementById('memDeleteSelected').style.visibility = 'visible';
    }
}


    function memDeleteButton() {
        let checkboxes = $('input[name=members]'),
          deleteButton = $('#memDeleteSelected');
      
        for (let i = 0; i < checkboxes.length; i++) {
          if (checkboxes[i].checked) {
            deleteButton.show();
          } else if (!checkboxes[i].checked) {
            deleteButton.hide();
          }
        }
      }