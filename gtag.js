const pageView = url => {
    window.gtag("config", process.env.GA_TRACKING_ID, {
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
    event
};

export default gtag;