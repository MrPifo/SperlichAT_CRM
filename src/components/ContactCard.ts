import { datetime, utils } from "@core";

// contact-card.ts
class ContactCard extends HTMLElement {
    connectedCallback() {
        const firstName = this.getAttribute('firstname') || '';
        const lastName = this.getAttribute('lastname') || '';
        const email = this.getAttribute('email') || '';
        const phone = this.getAttribute('phone') || '';
        const dateOfBirth = this.getAttribute('birthday') || null;
        const gender = this.getAttribute('gender') || '';

        const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
        const defaultAvatarColor = utils.getDeterministicAvatarColor(initials); 
        const avatarColor = this.getAttribute('avatarcolor') || defaultAvatarColor;
        const fullName = `${firstName} ${lastName}`;
        let birthday;

        if (utils.isNullOrEmpty(dateOfBirth) || dateOfBirth === '0000-00-00') {
            birthday = 'Kein Geburtstag';
        } else {
            birthday = datetime.format(dateOfBirth, "dd.MM.yyyy");
        }

        const genderIcon = gender === 'M'
            ? '<i class="mars icon"></i>'
            : gender === 'W'
                ? '<i class="venus icon"></i>'
                : '';

        const genderClass = gender === 'M' ? 'male' : gender === 'W' ? 'female' : '';

        this.className = 'column';
        const emailRow = email
            ? `<div class="contact-detail"><i class="envelope icon"></i>${email}</div>`
            : '';
        const phoneRow = phone
            ? `<div class="contact-detail"><i class="phone icon"></i>${phone}</div>`
            : '';
        const birthdayRow = !datetime.isEmpty(dateOfBirth)
            ? `<div class="contact-detail"><i class="birthday cake icon"></i>${birthday}</div>`
            : '';

        this.innerHTML = `
            <div class="ui contact-card fluid">
                <div class="contact-header">
                    <div class="contact-avatar" style="background: ${avatarColor};">${initials}</div>
                    <div class="contact-basic">
                        <div class="contact-name">${fullName}</div>
                        <div class="contact-gender ${genderClass}">
                            ${genderIcon}
                        </div>
                    </div>
                </div>
                <div class="contact-details">
                    ${emailRow}
                    ${phoneRow}
                    ${birthdayRow}
                </div>
            </div>
        `;
    }
}

customElements.define('contact-card', ContactCard);