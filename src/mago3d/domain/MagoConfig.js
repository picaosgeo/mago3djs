'use strict';

/**
 * mago3D 전체 환경 설정을 관리
 * @class MagoConfig
 */
var MagoConfig = {};

MagoConfig.getPolicy = function() 
{
	return this.serverPolicy;
};

MagoConfig.getData = function(key) 
{
	return this.dataMap.get(key);
};

MagoConfig.isDataExist = function(key) 
{
	return this.dataMap.has(key);
};

MagoConfig.deleteData = function(key) 
{
	return this.dataMap.delete(key);
};

/**
 * data 를 map에 저장
 * @param key map에 저장될 key
 * @param value map에 저장될 value
 */
MagoConfig.setData = function(key, value) 
{
	if (!this.isDataExist(key)) 
	{
		this.dataMap.set(key, value);
	}
};

/**
 * F4D Converter 실행 결과물이 저장된 project data folder 명을 획득
 * @param projectDataFolder data folder
 */
MagoConfig.getProjectDataFolder = function(projectDataFolder) 
{
	var key = CODE.PROJECT_DATA_FOLDER_PREFIX + projectDataFolder;
	return this.dataMap.get(key);
};

/**
 * project map에 data folder명의 존재 유무를 검사
 * @param projectDataFolder
 */
MagoConfig.isProjectDataFolderExist = function(projectDataFolder) 
{
	var key = CODE.PROJECT_DATA_FOLDER_PREFIX + projectDataFolder;
	return this.dataMap.has(key);
};

/**
 * project data folder명을 map에서 삭제
 * @param projectDataFolder
 */
MagoConfig.deleteProjectDataFolder = function(projectDataFolder) 
{
	var key = CODE.PROJECT_DATA_FOLDER_PREFIX + projectDataFolder;
	return this.dataMap.delete(key);
};

/**
 * project data folder명을 map에서 삭제
 * @param projectDataFolder map에 저장될 key
 * @param value map에 저장될 value
 */
MagoConfig.setProjectDataFolder = function(projectDataFolder, value) 
{
	var key = CODE.PROJECT_DATA_FOLDER_PREFIX + projectDataFolder;
	if (!this.isProjectDataFolderExist(key)) 
	{
		this.dataMap.set(key, value);
	}
};

/**
 * 환경설정 초기화
 * @param serverPolicy mago3d policy(json)
 * @param projectIdArray data 정보를 map 저장할 key name
 * @param projectDataArray data 정보(json)
 */
MagoConfig.init = function(serverPolicy, projectIdArray, projectDataArray) 
{
	this.dataMap = new Map();
	
	this.selectHistoryMap = new Map();
	this.movingHistoryMap = new Map();
	this.colorHistoryMap = new Map();
	this.locationAndRotationHistoryMap = new Map();
	
	this.serverPolicy = serverPolicy;
	if (projectIdArray !== null && projectIdArray.length > 0) 
	{
		for (var i=0; i<projectIdArray.length; i++) 
		{
			if (!this.isDataExist(CODE.PROJECT_ID_PREFIX + projectIdArray[i])) 
			{
				this.setData(CODE.PROJECT_ID_PREFIX + projectIdArray[i], projectDataArray[i]);
				this.setProjectDataFolder(CODE.PROJECT_DATA_FOLDER_PREFIX + projectDataArray[i].data_key, projectDataArray[i].data_key);
			}
		}
	}
};

/**
 * 모든 데이터를 삭제함
 */
MagoConfig.clearAllData = function() 
{
	this.dataMap.clear();
};

/**
 * 모든 선택 히스토리 삭제
 */
MagoConfig.clearSelectHistory = function() 
{
	this.selectHistoryMap.clear();
};

/**
 * 모든 object 선택 내용 이력을 취득
 */
MagoConfig.getAllSelectHistory = function()
{
	return this.selectHistoryMap;
};

/**
 * project 별 해당 키에 해당하는 모든 object 선택 내용 이력을 취득
 */
MagoConfig.getSelectHistoryObjects = function(projectId, dataKey)
{
	// projectId 별 map을 검사
	var projectIdMap = this.selectHistoryMap.get(projectId);
	if (projectIdMap === undefined) { return undefined; }
	// dataKey 별 map을 검사
	var dataKeyMap = projectIdMap.get(dataKey);
	return dataKeyMap;
};

/**
 * object 선택 내용 이력을 취득
 */
MagoConfig.getSelectHistoryObject = function(projectId, dataKey, objectIndexOrder)
{
	// projectId 별 map을 검사
	var projectIdMap = this.selectHistoryMap.get(projectId);
	if (projectIdMap === undefined) { return undefined; }
	// dataKey 별 map을 검사
	var dataKeyMap = projectIdMap.get(dataKey);
	if (dataKeyMap === undefined) { return undefined; }
	// objectIndexOrder 를 저장
	return dataKeyMap.get(objectIndexOrder);
};

/**
 * object 선택 내용을 저장
 */
MagoConfig.saveSelectHistory = function(projectId, dataKey, objectIndexOrder, changeHistory) 
{
	// projectId 별 map을 검사
	var projectIdMap = this.selectHistoryMap.get(projectId);
	if (projectIdMap === undefined) 
	{
		projectIdMap = new Map();
		this.selectHistoryMap.set(projectId, projectIdMap);
	}
	
	// dataKey 별 map을 검사
	var dataKeyMap = projectIdMap.get(dataKey);
	if (dataKeyMap === undefined) 
	{
		dataKeyMap = new Map();
		projectIdMap.set(dataKey, dataKeyMap);
	}
	
	// objectIndexOrder 를 저장
	dataKeyMap.set(objectIndexOrder, changeHistory);
};

/**
 * object 선택 내용을 삭제
 */
MagoConfig.deleteSelectHistoryObject = function(projectId, dataKey, objectIndexOrder)
{
	// projectId 별 map을 검사
	var projectIdMap = this.selectHistoryMap.get(projectId);
	if (projectIdMap === undefined) { return undefined; }
	// dataKey 별 map을 검사
	var dataKeyMap = projectIdMap.get(dataKey);
	if (dataKeyMap === undefined) { return undefined; }
	// objectIndexOrder 를 저장
	return dataKeyMap.delete(objectIndexOrder);
};

/**
 * 모든 이동 히스토리 삭제
 */
MagoConfig.clearMovingHistory = function() 
{
	this.movingHistoryMap.clear();
};

/**
 * 모든 object 선택 내용 이력을 취득
 */
MagoConfig.getAllMovingHistory = function()
{
	return this.movingHistoryMap;
};

/**
 * project별 입력키 값과 일치하는 object 이동 내용 이력을 취득
 */
MagoConfig.getMovingHistoryObjects = function(projectId, dataKey)
{
	// projectId 별 map을 검사
	var projectIdMap = this.movingHistoryMap.get(projectId);
	if (projectIdMap === undefined) { return undefined; }
	// dataKey 별 map을 검사
	var dataKeyMap = projectIdMap.get(dataKey);
	return dataKeyMap;
};

/**
 * object 이동 내용 이력을 취득
 */
MagoConfig.getMovingHistoryObject = function(projectId, dataKey, objectIndexOrder)
{
	// projectId 별 map을 검사
	var projectIdMap = this.movingHistoryMap.get(projectId);
	if (projectIdMap === undefined) { return undefined; }
	// dataKey 별 map을 검사
	var dataKeyMap = projectIdMap.get(dataKey);
	if (dataKeyMap === undefined) { return undefined; }
	// objectIndexOrder 를 저장
	return dataKeyMap.get(objectIndexOrder);
};

/**
 * object 이동 내용을 저장
 */
MagoConfig.saveMovingHistory = function(projectId, dataKey, objectIndexOrder, changeHistory) 
{
	// projectId 별 map을 검사
	var projectIdMap = this.movingHistoryMap.get(projectId);
	if (projectIdMap === undefined) 
	{
		projectIdMap = new Map();
		this.movingHistoryMap.set(projectId, projectIdMap);
	}
	
	// dataKey 별 map을 검사
	var dataKeyMap = projectIdMap.get(dataKey);
	if (dataKeyMap === undefined) 
	{
		dataKeyMap = new Map();
		projectIdMap.set(dataKey, dataKeyMap);
	}
	
	// objectIndexOrder 를 저장
	dataKeyMap.set(objectIndexOrder, changeHistory);
};

/**
 * object 이동 내용을 삭제
 */
MagoConfig.deleteMovingHistoryObject = function(projectId, dataKey, objectIndexOrder)
{
	// projectId 별 map을 검사
	var projectIdMap = this.movingHistoryMap.get(projectId);
	if (projectIdMap === undefined) { return undefined; }
	// dataKey 별 map을 검사
	var dataKeyMap = projectIdMap.get(dataKey);
	if (dataKeyMap === undefined) { return undefined; }
	// objectIndexOrder 를 저장
	return dataKeyMap.delete(objectIndexOrder);
};

/**
 * 모든 색깔 변경 이력을 획득
 */
MagoConfig.getAllColorHistory = function() 
{
	return this.colorHistoryMap;
};

/**
 * 모든 색깔변경 히스토리 삭제
 */
MagoConfig.clearColorHistory = function() 
{
	this.colorHistoryMap.clear();
};

/**
 * project별 키에 해당하는 모든 색깔 변경 이력을 획득
 */
MagoConfig.getColorHistorys = function(projectId, dataKey)
{
	// projectId 별 map을 검사
	var projectIdMap = this.colorHistoryMap.get(projectId);
	if (projectIdMap === undefined) { return undefined; }
	// dataKey 별 map을 검사
	var dataKeyMap = projectIdMap.get(dataKey);
	return dataKeyMap;
};

/**
 * 색깝 변경 이력을 획득
 */
MagoConfig.getColorHistory = function(projectId, dataKey, objectId)
{
	// projectId 별 map을 검사
	var projectIdMap = this.colorHistoryMap.get(projectId);
	if (projectIdMap === undefined) { return undefined; }
	// dataKey 별 map을 검사
	var dataKeyMap = projectIdMap.get(dataKey);
	if (dataKeyMap === undefined) { return undefined; }
	// objectId 를 저장
	return dataKeyMap.get(objectId);
};

/**
 * 색깝 변경 내용을 저장
 */
MagoConfig.saveColorHistory = function(projectId, dataKey, objectId, changeHistory) 
{
	// projectId 별 map을 검사
	var projectIdMap = this.colorHistoryMap.get(projectId);
	if (projectIdMap === undefined) 
	{
		projectIdMap = new Map();
		this.colorHistoryMap.set(projectId, projectIdMap);
	}
	
	// dataKey 별 map을 검사
	var dataKeyMap = projectIdMap.get(dataKey);
	if (dataKeyMap === undefined) 
	{
		dataKeyMap = new Map();
		projectIdMap.set(dataKey, dataKeyMap);
	}

	if (objectId === null || objectId === "") 
	{
		dataKeyMap.set(dataKey, changeHistory);
	}
	else 
	{
		dataKeyMap.set(objectId, changeHistory);
	}
};

/**
 * 색깔 변경 이력을 삭제
 */
MagoConfig.deleteColorHistory = function(projectId, dataKey, objectId)
{
	// projectId 별 map을 검사
	var projectIdMap = this.colorHistoryMap.get(projectId);
	if (projectIdMap === undefined) { return undefined; }
	// dataKey 별 map을 검사
	var dataKeyMap = projectIdMap.get(dataKey);
	if (dataKeyMap === undefined) { return undefined; }
	// objectIndexOrder 를 저장
	return dataKeyMap.delete(objectId);
};

/**
 * 모든 색깔변경 히스토리 삭제
 */
MagoConfig.clearColorHistory = function() 
{
	this.colorHistoryMap.clear();
};

/**
 * 모든 location and rotation 변경 이력을 획득
 */
MagoConfig.getAllLocationAndRotationHistory = function() 
{
	return this.locationAndRotationHistoryMap;
};

/**
 * 프로젝트별 해당 키 값을 갖는 모든 location and rotation 이력을 획득
 */
MagoConfig.getLocationAndRotationHistorys = function(projectId, dataKey)
{
	// projectId 별 map을 검사
	var projectIdMap = this.locationAndRotationHistoryMap.get(projectId);
	if (projectIdMap === undefined) { return undefined; }
	// dataKey 별 map을 검사
	var dataKeyMap = projectIdMap.get(dataKey);
	return dataKeyMap;
};

/**
 * location and rotation 이력을 획득
 */
MagoConfig.getLocationAndRotationHistory = function(projectId, dataKey)
{
	// projectId 별 map을 검사
	var projectIdMap = this.locationAndRotationHistoryMap.get(projectId);
	if (projectIdMap === undefined) { return undefined; }
	// dataKey 별 map을 검사
	var dataKeyMap = projectIdMap.get(dataKey);
	
	return dataKeyMap;
};

/**
 * location and rotation 내용을 저장
 */
MagoConfig.saveLocationAndRotationHistory = function(projectId, dataKey, changeHistory) 
{
	// projectId 별 map을 검사
	var projectIdMap = this.locationAndRotationHistoryMap.get(projectId);
	if (projectIdMap === undefined) 
	{
		projectIdMap = new Map();
		this.locationAndRotationHistoryMap.set(projectId, projectIdMap);
	}
	
	// dataKey 별 map을 검사
	var dataKeyMap = projectIdMap.get(dataKey);
	if (dataKeyMap === undefined) 
	{
		dataKeyMap = new Map();
	}

	dataKeyMap.set(dataKey, changeHistory);
};

/**
 * location and rotation 이력을 삭제
 */
MagoConfig.deleteLocationAndRotationHistory = function(projectId, dataKey)
{
	// projectId 별 map을 검사
	var projectIdMap = this.locationAndRotationHistoryMap.get(projectId);
	if (projectIdMap === undefined) { return undefined; }
	// dataKey 별 map을 검사
	var dataKeyMap = projectIdMap.delete(dataKey);
};

/**
 * 모든 location and rotation 히스토리 삭제
 */
MagoConfig.clearLocationAndRotationHistory = function() 
{
	this.locationAndRotationHistoryMap.clear();
};
	
/**
 * TODO 이건 나중에 활요. 사용하지 않음
 * check 되지 않은 데이터들을 삭제함
 * @param keyMap 비교할 맵
 */
MagoConfig.clearUnSelectedData = function(keyMap) 
{
	for (var key of this.dataMap.keys()) 
	{
		if (!keyMap.has(key)) 
		{
			// data folder path가 존재하면....
			if (key.indexOf(CODE.PROJECT_DATA_FOLDER_PREFIX) >= 0) 
			{
				// 지우는 처리가 있어야 함
			}
			this.dataMap.delete(key);
		}
	}
};
