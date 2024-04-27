frappe.ui.form.on('Delivery Note', {
    refresh(frm) {
        cur_frm.set_df_property('scan_barcode', 'hidden',true);


        if (frm.doc.__islocal) {
            frm.clear_table("items");
        }
    },
    custom_scan_batch_no: function(frm, cdt, cdn) {
        
        
        // Check if the batch already exists in the items table
        const existingRow = frm.doc.items.find(d => d.batch_no === frm.doc.custom_scan_batch_no);
        if (existingRow) {
            // If the batch already exists, notify the user and clear the field
            frappe.msgprint(__("Batch already exists in the table"));
            frm.set_value("custom_scan_batch_no", "");
            frm.refresh_field("custom_scan_batch_no");
        } else {
            // If the batch does not exist, make a server call to get the batch details
            frappe.call({
                method: "meher.utilis.get_item_batch",
                args: {
                    batch: frm.doc.custom_scan_batch_no
                },
                callback: function(r) {
                    if (r.message.error) {
                        // If there is an error in the response, possibly handle it here
                        return;
                    }
                    if (r.message) {
                        // Add the new batch details to the items table
                        frm.add_child("items", {
                            item_code: r.message.item_code,
                            item_name: r.message.item_name,
                            qty: r.message.qty,
                            batch_no: r.message.batch_no,
                            uom: r.message.uom
                        });
                        frm.refresh_field("items");
                        frm.set_value("custom_scan_batch_no", "");
                        frm.refresh_field("custom_scan_batch_no");
                    }
                }
            });
        }
    }
});
