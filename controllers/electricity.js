const Electricity = require("../models/electricity");

exports.getElectricityState = async (req, res) => {
  try {
    const electricity = await Electricity.findOne();
    res.json(electricity);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch electricity state" });
  }
};

exports.updateElectricityState = async (req, res) => {
  try {
    const { state } = req.body;

    // Find the first electricity state in the database
    const electricity = await Electricity.findOne();

    // Update the state
    electricity.state = state;
    electricity.lastStateChange = new Date();

    // Save the updated state
    await electricity.save();

    res.status(200).json(electricity);
  } catch (error) {
    console.error("Error updating electricity state:", error);
    res.status(500).send({ error: "Failed to update electricity state" });
  }
};

exports.createElectricityState = async (req, res) => {  
    try {
        const { state } = req.body;
    
        // Create a new electricity state using the schema
        const electricity = new Electricity({
        state: state || "OFF", // Default to "OFF" if state is not provided
        });
    
        // Save to the database
        await electricity.save();
    
        res.status(201).send({ message: "Electricity state created successfully", electricity });
    } catch (error) {
        console.error("Error creating electricity state:", error);
        res.status(500).send({ error: "Failed to create electricity state" });
    }
    };