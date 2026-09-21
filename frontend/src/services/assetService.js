const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function getAssets() {
  const response = await fetch(`${API_BASE_URL}/assets/`);

  if (!response.ok) {
    throw new Error("Failed to fetch assets");
  }

  return response.json();
}

export async function getAsset(assetId) {
  const response = await fetch(
    `${API_BASE_URL}/assets/${assetId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch asset");
  }

  return response.json();
}

export async function createInspectionTask(taskData) {
  const response = await fetch(
    `${API_BASE_URL}/inspection-tasks/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create inspection task");
  }

  return response.json();
}

export async function getInspectionTasks() {
  const response = await fetch(
    `${API_BASE_URL}/inspection-tasks/`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch inspection tasks");
  }

  return response.json();
}

export async function updateInspectionTaskStatus(
  taskId,
  status
) {
  const response = await fetch(
    `${API_BASE_URL}/inspection-tasks/${taskId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to update inspection task status"
    );
  }

  return response.json();
}

export async function getRiskSnapshots(assetId) {
  const response = await fetch(
    `${API_BASE_URL}/risk-snapshots/${assetId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch risk snapshots");
  }

  return response.json();
}

export async function createRiskSnapshot(assetId) {
  const response = await fetch(
    `${API_BASE_URL}/risk-snapshots/${assetId}`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create risk snapshot");
  }

  return response.json();
}

export async function getAlerts(resolved = false) {
  const response = await fetch(
    `${API_BASE_URL}/alerts/?resolved=${resolved}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch alerts");
  }

  return response.json();
}

export async function resolveAlert(alertId) {
  const response = await fetch(
    `${API_BASE_URL}/alerts/${alertId}/resolve`,
    {
      method: "PATCH",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to resolve alert");
  }

  return response.json();
}