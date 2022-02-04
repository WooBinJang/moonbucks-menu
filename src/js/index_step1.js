const $ = (selector) => document.querySelector(selector);

function App() {
  // 상단의 메뉴 갯수 표시 중복되는 코드
  const updateMenuCount = () => {
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };
  //확인 버튼과 엔터키 입력 이벤트에 중복되는 코드
  const addMenuName = () => {
    // 사용자 입력이 빈 값이라면 추가되지 않음
    if ($("#espresso-menu-name").value === "") {
      alert("메뉴명을 입력해주세요.");
      return;
    }

    // 사용자 입력이 기존에 추가 된 메뉴와 동일 할 경우 추가되지 않음
    const menuList = $("#espresso-menu-list").querySelectorAll("span");
    for (let menu of menuList) {
      if (menu.innerText === $("#espresso-menu-name").value) {
        alert("동일한 메뉴는 추가 할 수 없습니다.");
        return;
      }
    }

    //추가되는 메뉴의 아래 마크업은 <ul id="espresso-menu-list" class="mt-3 pl-0"></ul> 안에 삽입
    const espressoMenuName = $("#espresso-menu-name").value;
    const menuItemTemplate = (espressoMenuName) => {
      return `
        <li class="menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
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
    };
    $("#espresso-menu-list").insertAdjacentHTML(
      "beforeend",
      menuItemTemplate(espressoMenuName)
    );

    updateMenuCount();
    $("#espresso-menu-name").value = "";
  };

  const UpdateMenuName = (e) => {
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요.", $menuName.innerText);
    $menuName.innerText = updatedMenuName;
  };

  const RemoveMenuName = (e) => {
    const $menuName = e.target.closest("li").querySelector(".menu-name");

    if (confirm(` ${$menuName.innerText} 메뉴를 정말 삭제하시겠습니까?`)) {
      e.target.closest("li").remove();
      updateMenuCount();
    }
  };

  // form 태그가 자동으로 전송되는 이벤트 막기
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  /* 메뉴추가 */

  $("#espresso-menu-submit-button").addEventListener("click", addMenuName);

  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addMenuName();
    }
  });

  /* 메뉴삭제 */
  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-remove-button")) {
      RemoveMenuName(e);
    }
  });

  /* 메뉴수정 */
  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      UpdateMenuName(e);
    }
  });
}
App();
