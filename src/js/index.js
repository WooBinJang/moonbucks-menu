import { $ } from "./utils/dom.js";
import store from "./store/index.js";

function App() {
  // 상태는 변하는 데이터 -  메뉴명
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = "espresso";

  this.init = () => {
    if (store.getLocalStorage()) {
      this.menu = store.getLocalStorage();
    }
    render();
    initEventListeners();
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((item, index) => {
        return `
        <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name ${item.soldOut ? "sold-out" : ""}">${
          item.name
        }</span>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
        >
          품절
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
        >
          수정
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
        >
          삭제
        </button>
      </li>
    `;
      })
      .join("");

    $("#menu-list").innerHTML = template;
    updateMenuCount();
  };

  // 상단의 메뉴 갯수 표시 중복되는 코드
  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };
  //확인 버튼과 엔터키 입력 이벤트에 중복되는 코드
  const addMenuName = () => {
    // 사용자 입력이 빈 값이라면 추가되지 않음
    if ($("#menu-name").value === "") {
      alert("메뉴명을 입력해주세요.");
      return;
    }

    // 사용자 입력이 기존에 추가 된 메뉴와 동일 할 경우 추가되지 않음
    const menuList = $("#menu-list").querySelectorAll("span");
    for (let menu of menuList) {
      if (menu.innerText === $("#menu-name").value) {
        alert("동일한 메뉴는 추가 할 수 없습니다.");
        return;
      }
    }

    //추가되는 메뉴의 아래 마크업은 <ul id="espresso-menu-list" class="mt-3 pl-0"></ul> 안에 삽입
    const espressoMenuName = $("#menu-name").value;
    this.menu[this.currentCategory].push({ name: espressoMenuName }); // object[key]
    store.setLocalStorage(this.menu);
    render();
    $("#menu-name").value = "";
  };

  const UpdateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요.", $menuName.innerText);
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    store.setLocalStorage(this.menu);
    render();
  };

  const RemoveMenuName = (e) => {
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    if (confirm(` ${$menuName.innerText} 메뉴를 정말 삭제하시겠습니까?`)) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      render();
    }
  };

  const soldOutMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  };

  const initEventListeners = () => {
    // form 태그가 자동으로 전송되는 이벤트 막기
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    /* 메뉴추가 */
    $("#menu-submit-button").addEventListener("click", addMenuName);

    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        addMenuName();
      }
    });

    /* 메뉴 삭제 / 수정 */
    $("#menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-remove-button")) {
        RemoveMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-edit-button")) {
        UpdateMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });

    $("nav").addEventListener("click", (e) => {
      const isCategoryButton =
        e.target.classList.contains("cafe-category-name");
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
        render();
      }
    });
  };
}

const app = new App();
app.init();
