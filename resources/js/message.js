const selectedContact = $('meta[name="selected-contact"]');
const baseUrl = $('meta[name="base-url"]').attr("content");
const inbox = $(".messages ul");

function toggleLoader() {
    $(".loader").toggleClass("d-none");
}

function messageTemplate(text, className) {
    return `<li class="${className}">
    <img src="${baseUrl}/default-image/avatar.jpg" alt="" />
    <p>${text}
    </p>
</li>
`;
}

function fetchMessages() {
    let contactId = selectedContact.attr("content");
    $.ajax({
        type: "GET",
        url: baseUrl + "/fetch-messages",
        data: {
            contact_id: contactId,
        },
        dataType: "json",
        beforeSend: function () {
            toggleLoader();
        },
        success: function (response) {
            setContactInfo(response.contact);
        },
        error: function (xhr, status, error) {},
        complete: function () {
            toggleLoader();
        },
    });
}

function sendMesage() {
    let contactId = selectedContact.attr("content");
    let messageBox = $(".message-box");
    let formData = $(".message-form").serialize();
    $.ajax({
        type: "POST",
        url: baseUrl + "/send-messages",
        data: formData + "&contact_id=" + contactId,
        dataType: "json",
        beforeSend: function () {
            let message = messageBox.val();
            inbox.append(messageTemplate(message, "replies"));
            messageBox.val("");
        },
        success: function (response) {
            fetchMessages();
        },
        error: function (xhr, status, error) {},
    });
}

function setContactInfo(contact) {
    $(".contact-name").text(contact.name);
}

$(document).ready(function () {
    $(".contact").on("click", function () {
        let contactId = $(this).data("id");
        selectedContact.attr("content", contactId);

        // Fetch messages for the selected contact
        fetchMessages();
    });

    $(".message-form").on("submit", function (e) {
        e.preventDefault();
        sendMesage();
    });
});
