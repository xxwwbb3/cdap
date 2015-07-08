/*
 * Copyright © 2015 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

package co.cask.cdap.api.worker;

import co.cask.cdap.api.Resources;
import co.cask.cdap.api.annotation.Beta;
import co.cask.cdap.api.app.ApplicationConfigurer;
import co.cask.cdap.api.data.stream.Stream;
import co.cask.cdap.api.dataset.Dataset;
import co.cask.cdap.api.dataset.DatasetProperties;
import co.cask.cdap.api.dataset.module.DatasetModule;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * Extend this class to add workers.
 */
public abstract class AbstractWorker implements Worker {

  private WorkerConfigurer configurer;
  private WorkerContext context;

  @Override
  public final void configure(WorkerConfigurer configurer) {
    this.configurer = configurer;
    configure();
  }

  /**
   * Set the name of the {@link Worker}
   * @param name the name of the worker
   */
  protected void setName(String name) {
    configurer.setName(name);
  }

  /**
   * Set description of the {@link Worker}.
   * @param description the description
   */
  protected void setDescription(String description) {
    configurer.setDescription(description);
  }

  /**
   * Sets the resources requirements for the {@link Worker}.
   * @param resources the requirements
   */
  protected void setResources(Resources resources) {
    configurer.setResources(resources);
  }

  /**
   * Sets the number of instances needed for the {@link Worker}.
   * @param instances number of instances, must be > 0
   */
  protected void setInstances(int instances) {
    configurer.setInstances(instances);
  }

  /**
   * Sets a set of properties that will be available through the {@link WorkerSpecification#getProperties()}.
   * @param properties the properties to set
   */
  protected void setProperties(Map<String, String> properties) {
    configurer.setProperties(properties);
  }

  /**
   * Adds the names of {@link Dataset Datasets} used by the worker.
   * @param dataset dataset name
   * @param datasets more dataset names
   * @deprecated datasets used in runtime need not be specified in {@link Worker#configure}
   */
  @Deprecated
  protected void useDatasets(String dataset, String...datasets) {
    List<String> datasetList = new ArrayList<>();
    datasetList.add(dataset);
    datasetList.addAll(Arrays.asList(datasets));
    useDatasets(datasetList);
  }

  /**
   * Adds the names of {@link Dataset Datasets} used by the worker.
   * @param datasets dataset names
   * @deprecated datasets used in runtime need not be specified in {@link Worker#configure}
   */
  @Deprecated
  protected void useDatasets(Iterable<String> datasets) {
    configurer.useDatasets(datasets);
  }

  /**
   * @see ApplicationConfigurer#addStream(Stream)
   */
  protected void addStream(Stream stream) {
    configurer.addStream(stream);
  }

  /**
   * @see ApplicationConfigurer#addDatasetModule(String, Class)
   */
  @Beta
  protected void addDatasetModule(String moduleName, Class<? extends DatasetModule> moduleClass) {
    configurer.addDatasetModule(moduleName, moduleClass);
  }

  /**
   * @see ApplicationConfigurer#addDatasetType(Class)
   */
  @Beta
  protected void addDatasetType(Class<? extends Dataset> datasetClass) {
    configurer.addDatasetType(datasetClass);
  }

  /**
   * Calls {@link ApplicationConfigurer#createDataset(String, String, DatasetProperties)}, passing empty properties.
   *
   * @see ApplicationConfigurer#createDataset(String, String, DatasetProperties)
   */
  @Beta
  protected void createDataset(String datasetName, String typeName) {
    configurer.createDataset(datasetName, typeName, DatasetProperties.EMPTY);
  }

  /**
   * Calls {@link ApplicationConfigurer#createDataset(String, String, DatasetProperties)}, passing the type name and
   * properties.
   *
   * @see ApplicationConfigurer#createDataset(String, String, co.cask.cdap.api.dataset.DatasetProperties)
   */
  @Beta
  protected void createDataset(String datasetName, String typeName, DatasetProperties properties) {
    configurer.createDataset(datasetName, typeName, properties);
  }

  /**
   * Calls {@link ApplicationConfigurer#createDataset(String, String, DatasetProperties)}, passing the dataset class
   * and properties.
   *
   * @see ApplicationConfigurer#createDataset(String, Class, co.cask.cdap.api.dataset.DatasetProperties)
   */
  protected void createDataset(String datasetName,
                               Class<? extends Dataset> datasetClass,
                               DatasetProperties properties) {
    configurer.createDataset(datasetName, datasetClass, properties);
  }

  /**
   * Calls {@link ApplicationConfigurer#createDataset(String, Class, DatasetProperties)}, passing empty properties.
   *
   * @see ApplicationConfigurer#createDataset(String, Class, DatasetProperties)
   */
  protected void createDataset(String datasetName,
                               Class<? extends Dataset> datasetClass) {
    configurer.createDataset(datasetName, datasetClass, DatasetProperties.EMPTY);
  }

  /**
   * Returns the {@link WorkerConfigurer} used for configuration. Only available during configuration time.
   */
  protected final WorkerConfigurer getConfigurer() {
    return configurer;
  }

  /**
   * Configures the worker.
   */
  protected void configure() {

  }

  @Override
  public void initialize(WorkerContext context) throws Exception {
    this.context = context;
  }

  protected WorkerContext getContext() {
    return context;
  }

  @Override
  public void stop() {
    // default no-op
  }

  @Override
  public void destroy() {
    // default no-op
  }
}
