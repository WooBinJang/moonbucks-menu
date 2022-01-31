function App() {
  let input = document.querySelector("#espresso-menu-name");
  let li = document.createElement("li");
  // form에 있는 sumbit 이벤트 막기
  document
    .querySelector("#espresso-menu-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
    });

  // 입력창에 입력후 Enter 키 클릭 시 입력 값 받아오기
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      document.querySelector("#espresso-menu-list").appendChild(li).innerText =
        e.target.value;
      e.target.value = "";
    }
  });
}
App();
