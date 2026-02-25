const selectedContact = $('meta[name="selected-contact"]');
const baseUrl = $('meta[name="base-url"]').attr("content");

function fetchMessages() {
    let contactId = selectedContact.attr("content");
    $.ajax({
        type: "GET",
        url: baseUrl + "/fetch-messages",
        data: {
            contact_id: contactId,
        },
        dataType: "json",
        beforeSend: function () {},
        success: function (response) {
            setContactInfo(response.contact);
        },
        error: function (xhr, status, error) {},
    });
}

function setContactInfo(contact) {
    $('.contact-name').text(contact.name);
}

$(document).ready(function () {
    $(".contact").on("click", function () {
        let contactId = $(this).data("id");
        selectedContact.attr("content", contactId);

        // Fetch messages for the selected contact
        fetchMessages();
    });
});
