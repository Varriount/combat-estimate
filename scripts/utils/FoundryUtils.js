export class FoundryUtils
{

  static isFoundryVersion10()
  {
    return game.version.match(/^10\./) != null;
  }

  static getSystemId()
  {
    return game.system.id;
  }
  static getCompendiums()
  {
    return game.packs.filter((p) => !p.metadata.system || p.metadata.system === game.system.id);
  }

  static getCombatantDisposition(obj)
  {
    if (FoundryUtils.isFoundryVersion10())
    {
      throw new Error("No V10 work done yet");
    }
    else
    {
      return obj.token.data.disposition;
    }
  }

  static getSystemVariableForObject(object, variableName)
  {
    let currentSystem = game.system.id;
    let variableValues;
    if (FoundryUtils.isFoundryVersion10())
    {
      variableValues = SFLOCALCONSTS.SYSTEM_VARIABLES_V10[variableName];
    }
    else
    {
      variableValues = SFLOCALCONSTS.SYSTEM_VARIABLES[variableName];
    }

    if (!variableValues)
    {
      console.error(`Unable to find variable name ${variableName} information`);
      return;
    }

    let currentSystemVariableName = variableValues[currentSystem];
    if (!currentSystemVariableName)
    {
      console.error(`Unable to find variable name ${variableName} for system ${currentSystem}`);
      return;
    }
    return eval(`object.${currentSystemVariableName}`);
  }

  static getDataObjectFromObject(obj)
  {
    if (FoundryUtils.isFoundryVersion10())
    {
      if (obj.system)
      {
        return obj.system;
      }
      else
      {
        return obj;
      }
    }
    else
    {
      if (obj.data.data)
      {
        return obj.data.data;
      }
      else
      {
        return obj.data;
      }
    }
  }

  static getResultFromRollTable(rollTable, rollResult)
  {
    let rowSelected;
    for (let key in rollTable)
    {
      let value = rollTable[key];

      // if this is a single number
      if (key.indexOf("-") === -1)
      {
        let keyInteger = parseInt(key);
        if (rollResult === parseInt(key))
        {
          rowSelected = value;
          break;
        }
      }
      else
      {
        let rollRange = key.split("-");
        let lowerRange = parseInt(rollRange[0]);
        let higherRange = parseInt(rollRange[1]);

        if (lowerRange <= rollResult && rollResult <= higherRange)
        {
          rowSelected = value;
          break;
        }
      }
    }
    return rowSelected;
  }

  static getRandomItemFromRollTable(rollTable)
  {
    let lastRowInTableKeyValue = Object.keys(rollTable)[Object.keys(rollTable).length - 1];

    let maxNumberToRollFor;
    // if this is a single number
    if (lastRowInTableKeyValue.indexOf("-") === -1)
    {
      maxNumberToRollFor = lastRowInTableKeyValue;
    }
    else
    {
      let rollRange = lastRowInTableKeyValue.split("-");
      let higherRange = rollRange[1];

      maxNumberToRollFor = higherRange;
    }

    let randomItemNumber = Math.floor(Math.random() * maxNumberToRollFor) + 1;
    return FoundryUtils.getResultFromRollTable(rollTable, randomItemNumber);
  }

  static getRollResult(rollDescription)
  {
    let diceDescriptionParts = rollDescription.split("d");

    if (diceDescriptionParts.length != 2)
    {
      throw new Error(`Invalid dice description specified: ${rollDescription}`);
    }

    let numberOfDice = diceDescriptionParts[0];
    let diceSize = diceDescriptionParts[1];

    let totalDiceResult = 0;
    for (let i = 0; i < numberOfDice; i++)
    {
      totalDiceResult += Math.floor(Math.random() * diceSize) + 1;
    }

    return totalDiceResult;
  }
}