import { useState } from 'react'
import { supabase } from './supabaseClient'

function BecomeHelper({ user }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    city: '',
    area: '',
    role: 'Cook',
    experience: '',
    salary: '',
  })
  const [photoFile, setPhotoFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setMessage('Please log in before listing your services.')
      return
    }

    setSubmitting(true)
    setMessage('')

    let photoUrl = null

    if (photoFile) {
      const fileName = `${Date.now()}-${photoFile.name}`
      const { error: uploadError } = await supabase.storage
        .from('helper-photos')
        .upload(fileName, photoFile)

      if (uploadError) {
        setMessage('Photo upload failed. Please try again.')
        setSubmitting(false)
        console.error(uploadError)
        return
      }

      const { data: urlData } = supabase.storage
        .from('helper-photos')
        .getPublicUrl(fileName)

      photoUrl = urlData.publicUrl
    }

    const { error } = await supabase.from('helpers').insert({
      name: form.name,
      phone: form.phone,
      location: `${form.area}, ${form.city}`,
      role: form.role,
      experience: `${form.experience} years`,
      salary: form.salary,
      photo_url: photoUrl,
      verified: false,
      user_id: user.id,
    })

    setSubmitting(false)

    if (error) {
      setMessage('Something went wrong. Please try again.')
      console.error(error)
    } else {
      setMessage('Profile submitted! We will review it shortly.')
      setForm({ name: '', phone: '', city: '', area: '', role: 'Cook', experience: '', salary: '' })
      setPhotoFile(null)
    }
  }

  return (
    <div className="auth-container">
      <h2>List Your Services</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="area"
          placeholder="Area"
          value={form.area}
          onChange={handleChange}
          required
        />

        <select name="role" value={form.role} onChange={handleChange}>
          <option>Cook</option>
          <option>Housekeeper</option>
          <option>Babysitter</option>
          <option>Dishwasher</option>
          <option>Gardener</option>
          <option>Nanny for Elderly</option>
          <option>Nanny for Pets</option>
          <option>Driver</option>
          <option>Caretaker</option>
        </select>

        <input
          type="number"
          name="experience"
          placeholder="Years of Experience"
          value={form.experience}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="salary"
          placeholder="Expected Monthly Salary"
          value={form.salary}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhotoFile(e.target.files[0])}
        />

        <button className="primary-btn" type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Profile'}
        </button>

        {message && <p>{message}</p>}
      </form>
    </div>
  )
}

export default BecomeHelper