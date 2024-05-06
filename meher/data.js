frappe.ui.form.on('Customer', {
    refresh(frm) {
        // add a custom button on create group
        frm.add_custom_button(__('New Event'), function(){
  //perform desired action such as routing to new form or fetching etc.
}, __('Create'));

        
    },
  
});
