// if ($( window ).width() >= 1024) {
//   var controller = new ScrollMagic.Controller()
// }
//
// function getHeight(container_id, child_id) {
//   // console.log($(container_id).height() - $(child_id).height())
//   return $(container_id).height() - $(child_id).height()
// }
//
// $(function () {
//   let in_table = new ScrollMagic.Scene({triggerElement: "#table_breakdowns", duration: getHeight("#table_breakdowns", "#main_tables") })
//   .triggerHook(0)
//   .setPin("#main_tables")
//   .addIndicators() // add indicators
//   .addTo(controller);
//
//   new ScrollMagic.Scene({triggerElement: "#tables_jobs_para", duration: $("#tables_property_para").height() })
//   .triggerHook(0.1)
//   .addIndicators() // add indicators
//   .on("enter", (e) => {
//     console.log("enter")
//     $('[href="#jobs_tab"]').tab('show')
//   })
//   .addTo(controller)
//
//   new ScrollMagic.Scene({triggerElement: "#tables_property_para", duration: $("#tables_property_para").height() })
//   .triggerHook(0.1)
//   .addIndicators() // add indicators
//   .on("enter", (e) => {
//     console.log("enter")
//     $('[href="#property_tab"]').tab('show')
//   })
//   .addTo(controller)
//
//   new ScrollMagic.Scene({triggerElement: "#tables_donations_para", duration: $("#tables_donations_para").height() })
//   .triggerHook(0.1)
//   .addIndicators() // add indicators
//   .on("enter", (e) => {
//     console.log("enter")
//     $('[href="#donations_tab"]').tab('show')
//   })
//   .addTo(controller)
//
//   //scene.offset(window.innerHeight/2)
//
// });
