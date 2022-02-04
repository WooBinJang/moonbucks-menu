const store = {
  setLocalStorage(menu) {
    localStorage.setItem("menu", JSON.stringify(menu)); // localStorage 는 String 형태만 저장 가능
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem("menu"));
  },
};

export default store;
