const GA_TRACKING_ID = "G-SRJP48CE49";

const pageView = url => {
    window.gtag("config", GA_TRACKING_ID, {
        page_path: url,
    });
};

const event = ({ action, category, label, value }) => {
    window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
    });
};

const gtag = {
    pageView,
    event,
    trackingID: GA_TRACKING_ID
};

export default gtag;