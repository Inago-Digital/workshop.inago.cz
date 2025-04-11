document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle")
  const mobileMenu = document.getElementById("mobile-navigation")
  const navigation = document.getElementById("navigation")

  const classes = ["bg-white", "shadow-xl"]

  if (mobileMenuToggle && mobileMenu) {
    let isMenuOpen = false

    mobileMenuToggle.addEventListener("click", () => {
      isMenuOpen = !isMenuOpen

      if (isMenuOpen) {
        mobileMenu.style.display = "flex"
        navigation.classList.remove(...classes)
        document.body.style.overflow = "hidden"

        const bars = mobileMenuToggle.querySelectorAll("div")
        bars[0].style.transform = "rotate(45deg) translate(7px, 7px)"
        bars[1].style.opacity = "0"
        bars[2].style.transform = "rotate(-45deg) translate(7px, -7px)"
      } else {
        mobileMenu.style.display = "none"
        navigation.classList.add(...classes)
        document.body.style.overflow = ""

        const bars = mobileMenuToggle.querySelectorAll("div")
        bars[0].style.transform = ""
        bars[1].style.opacity = "1"
        bars[2].style.transform = ""
      }
    })

    const mobileMenuLinks = mobileMenu.querySelectorAll("a")
    mobileMenuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.style.display = "none"
        document.body.style.overflow = ""
        isMenuOpen = false

        const bars = mobileMenuToggle.querySelectorAll("div")
        bars[0].style.transform = ""
        bars[1].style.opacity = "1"
        bars[2].style.transform = ""
      })
    })
  }

  const contactForm = document.querySelector("[data-contact-form]")
  const contactFormSubmit = document.querySelector("[data-contact-form-submit]")
  const contactFormInputs = document.querySelectorAll(
    "[data-contact-form-input]"
  )
  const contactEmailError = document.querySelector("[data-email-error]")
  const contactEmailInput = contactFormInputs[1]
  const data = {
    name: "",
    email: "",
    telephone: "",
  }

  contactEmailInput.addEventListener("change", (event) => {
    const email = event.target.value
    if (!validateEmail(email)) {
      contactEmailError.classList.remove("hidden")
      contactFormSubmit.disabled = true
    } else {
      contactEmailError.classList.add("hidden")
      contactFormSubmit.disabled = false
    }
  })

  contactForm.addEventListener("input", (event) => {
    const { name, value } = event.target
    data[name] = value

    if (
      data.name &&
      data.email &&
      data.telephone &&
      validateEmail(data.email)
    ) {
      contactFormSubmit.disabled = false
    } else {
      contactFormSubmit.disabled = true
    }
  })

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) return false

    return true
  }

  if (contactForm && contactFormSubmit) {
    contactFormSubmit.addEventListener("click", async (e) => {
      e.preventDefault()

      contactFormInputs.forEach((input) => {
        data[input.name] = input.value
      })

      if (!data.name || !data.email || !data.telephone) {
        return alert("Vyplňte všechna pole.")
      }

      if (!validateEmail(data.email)) {
        return alert("Zadejte platnou e-mailovou adresu.")
      }

      contactFormSubmit.disabled = true
      contactFormSubmit.textContent = "Odesílám zprávu..."

      try {
        const response = await fetch("https://email.hangerthem.com/send", {
          method: "POST",
          body: JSON.stringify({
            to: "vladimir.wunsch@inago.cz",
            name: data.name,
            email: data.email,
            subject: "Nová rezervace",
            message: `
Name: ${data.name}
Email: ${data.email}
Phone: ${data.telephone}
`,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          alert("Message sent successfully.")
          contactForm.reset()
        } else {
          alert("An error occurred. Please try again.")
        }
      } catch (error) {
        alert("An error occurred. Please try again.")
      }

      contactFormSubmit.textContent = "Odeslat zprávu"
      contactFormSubmit.disabled = false
    })
  }
})
