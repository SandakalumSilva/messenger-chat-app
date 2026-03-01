const selectedContact = $('meta[name="selected-contact"]');
const authId = $('meta[name="auth_id"]').attr("content");
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
            //append messages
            inbox.empty();
            response.messages.forEach((value) => {
                let className = value.to_id == contactId ? "replies" : "sent";
                inbox.append(messageTemplate(value.message, className));
            });

            scrollToBottom();
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
            scrollToBottom();
        },
        success: function (response) {
            // fetchMessages();
        },
        error: function (xhr, status, error) {},
    });
}

function setContactInfo(contact) {
    $(".contact-name").text(contact.name);
}

function scrollToBottom() {
    $(".messages")
        .stop()
        .animate({
            scrollTop: $(".messages")[0].scrollHeight,
        });
}

$(document).ready(function () {
    $(".contact").on("click", function () {
        let contactId = $(this).data("id");
        selectedContact.attr("content", contactId);
        $(".blank-wrap").addClass("d-none");

        fetchMessages();
    });

    $(".message-form").on("submit", function (e) {
        e.preventDefault();
        sendMesage();
    });
});

//live events
window.Echo.private("message." + authId)
    .listen("SendMessageEvent", (e) => {
        if (e.from_id == selectedContact.attr("content")) {
            inbox.append(messageTemplate(e.text, "sent"));
        }
        scrollToBottom();
    })
    .error((error) => {
        console.error("Error in Echo:", error);
    });

window.Echo.join("online")
    .here((users) => {
        console.log("Online users:", users);
    })
    .joining((user) => {
        console.log("User joined:", user);
    })
    .leaving((user) => {
        console.log("User left:", user);
    })
    .error((error) => {
        console.error("Error in Echo:", error);
    });
