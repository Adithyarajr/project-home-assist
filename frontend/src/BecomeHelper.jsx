function BecomeHelper() {
  return (
    <div className="auth-container">

      <h2>List Your Services</h2>

      <input
        type="text"
        placeholder="Full Name"
      />

      <input
        type="text"
        placeholder="Phone Number"
      />

      <input
        type="text"
        placeholder="City"
      />

      <input
        type="text"
        placeholder="Area"
      />

      <select>
        <option>Cook</option>
        <option>Nanny</option>
        <option>Housekeeper</option>
        <option>Driver</option>
        <option>Caretaker</option>
      </select>

      <input
        type="number"
        placeholder="Years of Experience"
      />

      <input
        type="text"
        placeholder="Expected Monthly Salary"
      />

      <button className="primary-btn">
        Submit Profile
      </button>

    </div>
  )
}

export default BecomeHelper