import { $ } from "./utils/dom.js";
import store from "./store/index.js";
import MenuApi from "./api/index.js";

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

  this.init = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
    initEventListeners();
  };

  const render = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    const template = this.menu[this.currentCategory]
      .map((MenuItem) => {
        return `
        <li data-menu-id="${
          MenuItem.id
        }" class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name ${
          MenuItem.isSoldOut ? "sold-out" : ""
        }">${MenuItem.name}</span>
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

  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  const addMenuName = async () => {
    // 사용자 입력이 빈 값이라면 추가되지 않음
    if ($("#menu-name").value === "") {
      alert("메뉴명을 입력해주세요.");
      return;
    }

    const duplicatedITem = this.menu[this.currentCategory].find(
      (menuItem) => menuItem.name === $("#menu-name").value
    );
    if (duplicatedITem) {
      alert("이미 등록된 메뉴입니다. 다시입력해주세요.");
      $("#menu-name").value = "";
      return;
    }

    //추가되는 메뉴의 아래 마크업은 <ul id="espresso-menu-list" class="mt-3 pl-0"></ul> 안에 삽입
    const menuName = $("#menu-name").value;
    await MenuApi.createMenu(this.currentCategory, menuName);

    render();
    $("#menu-name").value = "";
  };

  const UpdateMenuName = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요.", $menuName.innerText);
    await MenuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);

    render();
  };

  const RemoveMenuName = async (e) => {
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    if (confirm(` ${$menuName.innerText} 메뉴를 정말 삭제하시겠습니까?`)) {
      const menuId = e.target.closest("li").dataset.menuId;
      await MenuApi.deleteMenu(this.currentCategory, menuId);

      render();
    }
  };

  const soldOutMenu = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);

    render();
  };

  const changeCategory = (e) => {
    const isCategoryButton = e.target.classList.contains("cafe-category-name");
    if (isCategoryButton) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;

      render();
    }
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

    $("nav").addEventListener("click", async (e) => {
      changeCategory(e);
    });
  };
}

const app = new App();
app.init();
