import frappe

@frappe.whitelist()
def get_item_batch(batch, container_no):
    if not frappe.db.exists('Batch', batch):
        return {'error': 'Batch not found'}

    
    item = frappe.get_doc("Batch", batch)
    if item.custom_container_no == container_no:
        return {'error': 'Batch not found'}
    return {
        'item_code': item.item,
        'item_name': item.item_name,
        'qty': item.batch_qty,
        'uom': item.stock_uom,
        'batch_no': item.name
    }
@frappe.whitelist()
def update_item_batch(doc, method=None):
    inv = frappe.get_doc("Purchase Receipt", doc)

    for item in inv.items:
        batch = frappe.get_doc("Batch", item.batch_no)
        batch.custom_supplier_batch_no = item.supplier_batch_no
        batch.custom_container_no = inv.custom_container_no
        batch.custom_cone = item.cone
        batch.custom_net_weight = item.qty
        batch.custom_lot_no = inv.custom_lot_no

        batch.save()
        frappe.db.commit()
