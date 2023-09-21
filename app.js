const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

// Configure AWS SDK with your credentials
AWS.config.update({
  region: 'ap-south-1',
  accessKeyId: '',
  secretAccessKey: '',
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const app = express();

app.use(bodyParser.json());

// Define your routes here


// Create a new item
app.post('/items', (req, res) => {
  const { name, description } = req.body;
  const params = {
    TableName: 'items',
    Item: {
      itemId: Math.random().toString(36).substring(7),
      name,
      description,
    },
  };
  
  dynamoDB.put(params, (error) => {
    if (error) {
      res.status(500).json({ error: 'Failed to create item' });
    } else {
      res.status(201).json({ message: 'Item created successfully' });
    }
  });
});

// Get all items
app.get('/items', (req, res) => {
  const params = {
    TableName: 'items',
  };
  
  dynamoDB.scan(params, (error, data) => {
    if (error) {
      res.status(500).json({ error: 'Failed to fetch items' });
    } else {
      res.status(200).json(data.Items);
    }
  });
});

// Get a specific item by ID
app.get('/items/:id', (req, res) => {
  const { id } = req.params;
  const params = {
    TableName: 'items',
    Key: {
      itemId: id,
    },
  };
  
  console.log("params", params)

  
  dynamoDB.get(params, (error, data) => {
    if (!error) {
      res.status(500).json({ error: 'Failed to fetch item' });
    } else {
      res.status(200).json(data);
    }
  });
});

// Update an item by ID
app.put('/items/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const params = {
    TableName: 'items',
    Key: {
      itemId: id,
    },
    UpdateExpression: 'set #name = :name, #description = :description',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#description': 'description',
    },
    ExpressionAttributeValues: {
      ':name': name,
      ':description': description,
    },
  };
  
  dynamoDB.update(params, (error) => {
    if (error) {
      res.status(500).json({ error: 'Failed to update item' });
    } else {
      res.status(200).json({ message: 'Item updated successfully' });
    }
  });
});

// Delete an item by ID
app.delete('/items/:id', (req, res) => {
  const { id } = req.params;
  const params = {
    TableName: 'items',
    Key: {
      itemId: id,
    },
  };
  
  dynamoDB.delete(params, (error) => {
    if (error) {
      res.status(500).json({ error: 'Failed to delete item' });
    } else {
      res.status(200).json({ message: 'Item deleted successfully' });
    }
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
