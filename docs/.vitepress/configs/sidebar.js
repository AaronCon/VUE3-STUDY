export default {
  "/composition": getCompositionSidebar(),
  // "/pratice": getPraticeSidebar(),
  // "/senior": getSeniorSidebar(),
};

function getCompositionSidebar() {
  return [
    {
      text: "组合式API",
      collapsible: false,
      items: [
        {
          text: "属性",
          link: "/composition/",
          
        },
        {
          text: "钩子函数",
          link: "/composition/func"
        }
      ]
    }
  ]
}